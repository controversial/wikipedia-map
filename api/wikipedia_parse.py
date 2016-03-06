#!/usr/local/bin/python
# -*- coding: utf-8 -*-

"""Functions for getting information about wikipedia pages. This contains the
code for all of the functions used by the backend of Wikipedia Map"""

import json
from urllib2 import quote, unquote

import bs4
import requests

# Base URL for API
_endpoint = "https://en.wikipedia.org/w/api.php"


# --- HELPER FUNCTIONS --- #


def get_page_title(url):
    """Get the title of a page quickly, but inaccurately from a URL. Allows
    both for URLs with a trailing slash and URLs without.

    This is considered inaccurate because this does not handle redirects. E.g.
    one page might link to /wiki/Cats, while another might link to /wiki/Cat.
    These are both the same page, but will be recognized as different."""
    # The last element of the URL is always the title.
    return url.rstrip('/').split('/')[-1]


def get_page_name(page):
    """Get the title of a page accurately, but more slowly. See get_page_title
    for notes on accuracy"""

    payload = {
        "format": "json",
        "action": "query",
        "titles": page,
        "redirects": 1
    }

    req = requests.get(_endpoint, params=payload)
    resp = json.loads(req.text)
    pagename = resp["query"]["pages"].values()[0]["title"]
    return quote(pagename.encode("utf-8"))


def is_article(name):
    """Decide whether the name of a wikipedia page is an article, or belongs to
    another namespace. See https://en.wikipedia.org/wiki/Wikipedia:Namespace"""
    # Pages outside of main namespace have colons in the middle, e.g. 'WP:UA'
    return ":" not in name.strip(":")


# --- MAIN FUNCTIONS --- #


def get_page_html(pagename):
    """Get a BeautifulSoup object representing the HTML for the first section
    of the Wikipedia article named <pagename>"""

    payload = {
        "format": "json",
        "action": "parse",
        "page": pagename,
        "prop": "text",
        "section": 0,
        "redirects": 1
    }

    req = requests.get(_endpoint, params=payload)
    resp = json.loads(req.text)

    if "error" in resp.keys():
        return None
    else:
        html = resp["parse"]["text"]["*"]
        return bs4.BeautifulSoup(html, "html.parser")


def get_first_paragraph(pagename):
    """Get a BeautifulSoup object representing the HTML for the first paragraph
    of the Wikipedia article named <pagename>"""
    html = get_page_html(pagename)
    if html is None:
        return None
    else:
        return html.find("p", recursive=False)


def first_paragraph_links(pagename):
    """Get the name of each Wikipedia article linked to from the first
    paragraph of the Wikipedia article named <pagename>"""
    p1 = get_first_paragraph(pagename)
    if p1 is None:
        return []
    else:
        links = [link.get("href") for link in p1.find_all("a")]
        links = [link for link in links if link.startswith("/wiki/")]
        links = [get_page_title(link) for link in links]
        links = [link.split("#")[0] for link in links]
        links = [link for link in links if is_article(link)]
        links = [link.replace("_", " ") for link in links]
        links = list(set(links))
        return links


def get_random_article():
    """Get the name of a random Wikipedia article"""

    payload = {
        "format": "json",
        "action": "query",
        "list": "random",
        "rnlimit": 1,
        "rnnamespace": 0  # Limits results to articles
    }

    req = requests.get(_endpoint, payload)
    resp = json.loads(req.text)
    return resp["query"]["random"][0]["title"]


if __name__ == "__main__":
    import time

    print is_article(":Cows"), is_article("WP:UA")  # Test if it's an article

    start = time.time()
    print get_page_name("Cats"),  # Test accurate page name fetch
    print "({} seconds)\n".format(time.time()-start)

    start = time.time()
    print get_random_article(),  # Test random article fetching
    print "({} seconds)\n".format(time.time()-start)

    start = time.time()
    print first_paragraph_links("Penguins"),  # Test link fetching
    print "({} seconds)\n".format(time.time()-start)

    start = time.time()
    print first_paragraph_links("Zürich"),  # Test unicode
    print "({} seconds)\n".format(time.time()-start)
