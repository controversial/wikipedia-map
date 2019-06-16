const endpoint = 'https://en.wikipedia.org/w/api.php';

const queryApi = query => $.get(endpoint, { format: 'json', origin: '*', ...query });

/**
Get the title of a page from a URL quickly,but inaccurately. Allows both for URLs with a trailing
slash and for URLs without.

This is considered inaccurate because this function not handle redirects, e.g. /wiki/Cats and
/wiki/Cat are the same article but produce different outputs with this function.
*/
const getPageTitle = url => url.split('/').filter(el => el).pop();

/**
Get the name of a Wikipedia page accurately by following redirects (slow)
*/
const getPageName = page =>
  new Promise((resolve, reject) => {
    queryApi({
      action: 'query',
      titles: page,
      redirects: 1,
    })
    .done(res => resolve(Object.values(res.query.pages)[0].title))
    .fail(reject);
  });

/**
Decide whether the name of a wikipedia page is an article, or belongs to another namespace.
See https://en.wikipedia.org/wiki/Wikipedia:Namespace
*/
// Pages outside of main namespace have colons in the middle, e.g. 'WP:UA'
// Remove any trailing colons and return true if the result still contains a colon
const isArticle = name => !(name.endsWith(':') ? name.slice(0, -1) : name).includes(':');


// --- MAIN FUNCTIONS ---

const getSubPages = pageName =>
  getPageHtml(pageName)
    .then(getFirstParagraph)
    .then(getWikiLinks);

/**
Get a cheerio object for the HTML of a Wikipedia page.
*/
const getPageHtml = pageName =>
  new Promise((resolve, reject) => {
    queryApi({
      action: 'parse',
      page: pageName,
      prop: 'text',
      section: 0,
      redirects: 1,
    })
    .done(res => resolve($($.parseHTML(res.parse.text['*']))))
    .fail(reject);
  });

/**
Get a cheerio object for the first body paragraph in page HTML.
@param {jQuery} $element - A jQuery object as returned by `getPageHtml`
*/
const getFirstParagraph = ($element) => {
  const out = $element.children('p:not(.mw-empty-elt)').first();
  // Get the correct paragraph if we selected the paragraph with the coordinates
  return out.find('#coordinates').length ? out.nextAll('p').first() : out;
}

/**
Get the name of each Wikipedia article linked.
@param {jQuery} $element - A jQuery object as returned by `getFirstParagraph`
*/
const getWikiLinks = $element =>
  $element
    .find("a")
    .map((_, link) => link.getAttribute("href"))
    .get()
    .filter(link => link.startsWith('/wiki/'))     // Only links to Wikipedia articles
    .map(getPageTitle)                             // Get the title
    .map(link => link.split('#')[0])               // Eliminate anchor links
    .filter(isArticle)                             // Make sure it's an article and not a part of another namespace
    .map(link => link.replace(/_/g, ' '))          // Replace underscores with spaces for more readable names
    .filter((n, i, self) => self.indexOf(n) === i); // Remove duplicates

/**
Get the name of a random Wikipedia article
*/
const getRandomArticle = () =>
  new Promise((resolve, reject) => {
    queryApi({
      action: 'query',
      list: 'random',
      rnlimit: 1,
      rnnamespace: 0, // Limits results to articles
    })
    .done(res => resolve(res.query.random[0].title))
    .fail(reject);
  });

/**
Get completion suggestions for a query
*/
const getSuggestions = search =>
  new Promise((resolve, reject) => {
    queryApi({
      action: 'opensearch',
      search,
      limit: 10,
      namespace: 0, // Limits results to articles
    })
    .done(res => resolve(res[1]))
    .fail(reject);
  });
