#!/usr/local/bin/python
# coding: utf-8
from __future__ import unicode_literals
import bs4
import urllib2

#Pretend not to be a bot
opener = urllib2.build_opener()
opener.addheaders = [('User-agent', 'Mozilla/5.0')]

def get_url(pagename):
    return "https://en.wikipedia.org/wiki/"+urllib2.quote(unicode(pagename).encode("utf-8"))

def get_page_title(url):
    #The last element of the URL is always the title. Allow for both URLs that
    #end with a slash and for URLs that don't.
    return url.rstrip('/').split('/')[-1]

def get_page_name(page):
    #The title of the page before the hyphen.
    return get_wiki_soup(get_url(page)).title.string.split("-")[0].strip()

def get_wiki_soup(url):
    #Open the URL
    f=opener.open(url)
    #Return the data, ascii decoded.
    data=str(f.read().decode("ascii",errors="ignore"))
    f.close()
    #Specify parser to hide error message
    return bs4.BeautifulSoup(data,"html.parser")

def get_random_article():
  randomurl="https://en.wikipedia.org/wiki/Special:Random"
  o = opener.open(randomurl)
  pageurl = o.geturl()
  return pageurl.split("/")[-1]

def first_paragraph_links(page):
    soup=get_wiki_soup(get_url(page))
    #Div with content in it
    content=soup.find("div",id="mw-content-text")
    #First p tag directly under the content div
    paragraphs=content.find_all("p",recursive=False)
    paragraph1=paragraphs[0]

    #If the first paragraph is coordinate info, use the second paragraph.
    firstlink = paragraph1.find("a")
    if "id" in firstlink.parent.attrs and firstlink.parent["id"]=="coordinates":
        paragraph1=paragraphs[1]

    #Find all links from the first paragraph (no duplicates)
    links = list(set([link.get("href") for link in paragraph1.find_all("a")]))
    #Exclude links that tag points later in the article, and return the page title.
    pagenames = [str(l.split("/")[-1]) for l in links if l.startswith("/wiki/")]
    #Remove files
    pagenames = [pn for pn in pagenames if not pn.startswith(("File:","Wikipedia:","Help:"))]
    #Remove underscores
    pagenames = [pn.replace("_"," ") for pn in pagenames]
    #Remove fragment identifiers
    return [pn.rsplit("#")[0] for pn in pagenames]



if __name__ == "__main__":
    print first_paragraph_links("Zürich")
