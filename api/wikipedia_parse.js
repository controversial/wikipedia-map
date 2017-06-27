const request = require('superagent');
const { URL } = require('url');
const path = require('path');

/**
Get the title of a page from a URL quickly,but inaccurately. Allows both for URLs with a trailing
slash and for URLs without.

This is considered inaccurate because this function not handle redirects, e.g. /wiki/Cats and
/wiki/Cat are the same article but produce different outputs with this function.
*/
exports.getPageTitle = function getPageTitle(url) {
  const p = new URL(url).pathname;
  return path.basename(p);
}
