const endpoint = 'https://en.wikipedia.org/w/api.php';

const domParser = new DOMParser();

function queryApi(query) {
  const url = new URL(endpoint);
  const params = { format: 'json', origin: '*', ...query };
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
  return fetch(url).then(response => response.json());
}

/**
Get the title of a page from a URL quickly, but inaccurately (no redirects)
TODO: rename this and getPageName to be clearer
*/
const getPageTitle = url => url.split('/').filter(el => el).pop();

/**
Get the name of a Wikipedia page accurately by following redirects (slow)
*/
function getPageName(page) {
  return queryApi({ action: 'query', titles: page, redirects: 1 })
    .then(res => Object.values(res.query.pages)[0].title);
}

/**
Decide whether the name of a wikipedia page is an article, or belongs to another namespace.
See https://en.wikipedia.org/wiki/Wikipedia:Namespace
*/
// Pages outside of main namespace have colons in the middle, e.g. 'WP:UA'
// Remove any trailing colons and return true if the result still contains a colon
const isArticle = name => !(name.endsWith(':') ? name.slice(0, -1) : name).includes(':');


// --- MAIN FUNCTIONS ---

/**
Get a DOM object for the HTML of a Wikipedia page.
*/
function getPageHtml(pageName) {
  return queryApi({ action: 'parse', page: pageName, prop: 'text', section: 0, redirects: 1 })
    .then(res => domParser.parseFromString(res.parse.text['*'], 'text/html'));
}

/**
Get a DOM object for the first body paragraph in page HTML.
@param {HtmlElement} element - An HTML element as returned by `getPageHtml`
*/
const getFirstParagraph = element => element.querySelector('p:not(.mw-empty-elt)');

/**
Get the name of each Wikipedia article linked.
@param {HtmlElement} element - An HTML element as returned by `getFirstParagraph`
*/
function getWikiLinks(element) {
  return Array.from(element.querySelectorAll('a'))
    .map(link => link.getAttribute('href'))
    .filter(link => link.startsWith('/wiki/')) // Only links to Wikipedia articles
    .map(getPageTitle) // Get the title
    .map(link => link.split('#')[0]) // Eliminate anchor links
    .filter(isArticle) // Make sure it's an article and not a part of another namespace
    .map(link => link.replace(/_/g, ' ')) // Replace underscores with spaces for more readable names
    .filter((n, i, self) => self.indexOf(n) === i); // Remove duplicates
}


function getSubPages(pageName) {
  return getPageHtml(pageName)
    .then(getFirstParagraph)
    .then(getWikiLinks);
}

/**
Get the name of a random Wikipedia article
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
Get completion suggestions for a query
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
