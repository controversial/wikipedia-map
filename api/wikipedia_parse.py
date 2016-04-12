#!/usr/local/bin/python
# -*- coding: utf-8 -*-

"""Functions for getting information about wikipedia pages. This contains the
code for all of the functions used by the backend of Wikipedia Map."""

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
    of the Wikipedia article named <pagename>. Will not resolve disambiguation
    pages."""

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


def get_nth_paragraph(html, n):
    """Get a BeautifulSoup object representing the HTML for the nth paragraph
    of the Wikipedia article named <pagename>"""
    if html is None:
        return None
    else:
        ps = html.find_all("p", recursive=False)
        # If the first paragraph in the HTML is that thing about coordinates,
        # shift the index by 1 so that we find only paragraphs of text.
        if ps[0].find("span", id="coordinates"):
            n += 1
        try:
            return ps[n]
        except IndexError:
            return bs4.BeautifulSoup("", "html.parser")


def get_links(html):
    """Get valid Wikipedia article links from a BeautifulSoup object."""
    links = [link.get("href") for link in html.find_all("a")]
    links = [link for link in links if link.startswith("/wiki/")]
    links = [get_page_title(link) for link in links]
    links = [link.split("#")[0] for link in links]
    links = [link for link in links if is_article(link)]
    links = [link.replace("_", " ") for link in links]
    links = list(set(links))
    return links


def first_paragraph_links(pagename):
    """Get the name of each Wikipedia article linked to from the first
    paragraph of the Wikipedia article named <pagename>"""
    html = get_page_html(pagename)
    p = get_nth_paragraph(html, 0)
    if p is None:
        return []
    else:
        n = 1
        # This loop is executed if the first paragraph contains no links. With
        # this loop, if an article contains links in the first section but not
        # in the first paragraph, wikipedia-map will find the first paragraph
        # that *does* contain links.
        while p.get_text() and not get_links(p):
            p = get_nth_paragraph(html, n)
            n += 1
        return get_links(p)


def get_random_article():
    """Get the name of a random Wikipedia article"""

    payload = {
        "format": "json",
        "action": "query",
        "list": "random",
        "rnlimit": 1,
        "rnnamespace": 0  # Limits results to articles
    }

    req = requests.get(_endpoint, params=payload)
    resp = json.loads(req.text)
    return resp["query"]["random"][0]["title"]


def get_suggestions(search):
    """Get the name of a random Wikipedia article"""

    payload = {
        "format": "json",
        "action": "opensearch",
        "search": search,
        "limit": 10,
        "namespace": 0  # Limits results to articles
    }

    req = requests.get(_endpoint, params=payload)
    resp = json.loads(req.text)
    return resp[1]


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
    print first_paragraph_links("Apple Computer"),  # Test link fetching
    print "({} seconds)\n".format(time.time()-start)

    start = time.time()
    print first_paragraph_links("Zürich"),  # Test unicode
    print "({} seconds)\n".format(time.time()-start)

    start = time.time()
    print first_paragraph_links("Peer-to-peer"),  # Test no-link fallback
    print "({} seconds)\n".format(time.time()-start)

    start = time.time()
    print get_suggestions("English"),  # Test suggestions
    print "({} seconds)\n".format(time.time()-start)