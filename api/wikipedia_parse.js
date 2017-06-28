const { URL } = require('url');
const path = require('path');

const request = require('superagent');
const cheerio = require('cheerio');

const endpoint = 'https://en.wikipedia.org/w/api.php';

/**
Get the title of a page from a URL quickly,but inaccurately. Allows both for URLs with a trailing
slash and for URLs without.

This is considered inaccurate because this function not handle redirects, e.g. /wiki/Cats and
/wiki/Cat are the same article but produce different outputs with this function.
*/
function getPageTitle(url) {
  const p = new URL(url).pathname;
  return path.basename(p);
}
exports.getPageTitle = getPageTitle;

/**
Get the name of a Wikipedia page accurately by following redirects (slow)
*/
function getPageName(page) {
  return new Promise((resolve, reject) => {
    request
      .get(endpoint)
      .query({
        format: 'json',
        action: 'query',
        titles: page,
        redirects: 1,
      })
      .end((err, res) => {
        if (err) reject(err);
        else resolve(Object.values(res.body.query.pages)[0].title)
      });
  });
}
exports.getPageName = getPageName;

/**
Decide whether the name of a wikipedia page is an article, or belongs to another namespace.
See https://en.wikipedia.org/wiki/Wikipedia:Namespace
*/
function isArticle(name) {
  // Pages outside of main namespace have colons in the middle, e.g. 'WP:UA'
  // Remove any trailing colons and return true if the result still contains a colon
  return !(name.endsWith(':') ? name.slice(0, -1) : name).includes(':');
}
exports.isArticle = isArticle;


// --- MAIN FUNCTIONS ---


/**
Get a cheerio object for the HTML of a Wikipedia page.
*/
function getPageHtml(pageName) {
  return new Promise((resolve, reject) => {
    request
      .get(endpoint)
      .query({
        format: 'json',
        action: 'parse',
        page: pageName,
        prop: 'text',
        section: 0,
        redirects: 1,
      })
      .end((err, res) => {
        if (err) reject(err);
        else resolve(cheerio.load(res.body.parse.text['*']));
      });
  });
}
exports.getPageHtml = getPageHtml;

/**
Get a cheerio object for the first body paragraph in page HTML.
@param {cheerio} $ - A cheerio object as returned by `getPageHtml`
*/
function getFirstParagraph($) {
  return $('.mw-parser-output > p').first();
}
exports.getFirstParagraph = getFirstParagraph;

/**
Get the name of each Wikipedia article linked.
@param {cheerio} $ - A cheerio object as returned by `getFirstParagraph`
*/
function getWikiLinks($) {
  const links = [];
  $.find('a').each((i, n) => {
    links.push(n.attribs.href);
  });
  return links;
}
exports.getWikiLinks = getWikiLinks;
