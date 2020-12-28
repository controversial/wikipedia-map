const base = 'https://en.wikipedia.org/w/api.php';

const domParser = new DOMParser();

/* Make a request to the Wikipedia API */
function queryApi(query) {
  const url = new URL(base);
  const params = { format: 'json', origin: '*', ...query };
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
  return fetch(url).then(response => response.json());
}

/**
 * Get the title of a page from a URL quickly, but inaccurately (no redirects)
 */
const getPageTitleQuickly = url => url.split('/').filter(el => el).pop().split('#')[0];

/**
 * Get the name of a Wikipedia page accurately by following redirects (slow)
 */
function fetchPageTitle(page) {
  return queryApi({ action: 'query', titles: page, redirects: 1 })
    .then(res => Object.values(res.query.pages)[0].title);
}

/**
 * Decide whether the name of a wikipedia page is an article, or belongs to another namespace.
 * See https://en.wikipedia.org/wiki/Wikipedia:Namespace
 */
// Pages outside of main namespace have colons in the middle, e.g. 'WP:UA'
// Remove any trailing colons and return true if the result still contains a colon
const isArticle = name => !(name.endsWith(':') ? name.slice(0, -1) : name).includes(':');


// --- MAIN FUNCTIONS ---

/**
 * Get a DOM object for the HTML of a Wikipedia page.
 * Also returns information about any redirects that were followed.
 */
function getPageHtml(pageName) {
  return queryApi({ action: 'parse', page: pageName, prop: 'text', section: 0, redirects: 1 })
    .then(res => ({
      document: domParser.parseFromString(res.parse.text['*'], 'text/html'),
      redirectedTo: res.parse.redirects[0] ? res.parse.redirects[0].to : pageName,
    }));
}

/**
 * Get a DOM object for the first body paragraph in page HTML.
 * @param {HtmlElement} element - An HTML element as returned by `getPageHtml`
 */
const getFirstParagraph = element =>
  // First paragraph that isn't marked as "empty"...
  Array.from(element.querySelectorAll('.mw-parser-output > p:not(.mw-empty-elt)'))
    // ...and isn't the "coordinates" container
    .find(p => !p.querySelector('#coordinates'));

/**
 * Get the name of each Wikipedia article linked.
 * @param {HtmlElement} element - An HTML element as returned by `getFirstParagraph`
 */
function getWikiLinks(element) {
  return Array.from(element.querySelectorAll('a'))
    .map(link => link.getAttribute('href'))
    .filter(href => href && href.startsWith('/wiki/')) // Only links to Wikipedia articles
    .map(getPageTitleQuickly) // Get the title from the URL
    .filter(isArticle) // Make sure it's an article and not a part of another namespace
    .map(title => title.replace(/_/g, ' ')) // Replace underscores with spaces for more readable names
    .filter((n, i, self) => self.indexOf(n) === i); // Remove duplicates
}

/**
 * Given a page title, get the first paragraph links, as well as the name of the page it redirected
 * to.
 */
function getSubPages(pageName) {
  return getPageHtml(pageName).then(({ document: doc, redirectedTo }) => ({
    redirectedTo,
    links: getWikiLinks(getFirstParagraph(doc)),
  }));
}

/**
 * Get the name of a random Wikipedia article
 */
function getRandomArticle() {
  return queryApi({
    action: 'query',
    list: 'random',
    rnlimit: 1,
    rnnamespace: 0, // Limits results to articles
  }).then(res => res.query.random[0].title);
}

/**
 * Get completion suggestions for a query
 */
function getSuggestions(search) {
  return queryApi({
    action: 'opensearch',
    search,
    limit: 10,
    namespace: 0, // Limits results to articles
  })
    .then(res => res[1]);
}
