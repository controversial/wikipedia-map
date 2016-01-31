#!/usr/local/bin/python
import bs4
import urllib2

#Pretend not to be a bot
opener = urllib2.build_opener()
opener.addheaders = [('User-agent', 'Mozilla/5.0')]

def get_url(pagename):
    #Use wikipedia API to get the url from a pagename (even if it's not exact)
    return "https://en.wikipedia.org/wiki/"+pagename

def get_page_title(url):
    #The last element of the URL is always the title. Allow for both URLs that
    #end with a slash and for URLs that don't.
    a,b = [url.split("/")[-n] for n in 1,2]
    return a if a else b

def get_page_name(page):
    #The title of the page before the hyphen.
    title = get_wiki_soup(get_url(page)).title
    return title.string.split("-")[0].strip()

def get_wiki_soup(url):
    #Open the URL
    f=opener.open(url)
    #Return the data, ascii decoded.
    data=f.read()
    data=str(data.decode("ascii",errors="ignore"))
    f.close()
    #Specify parser to hide error message
    return bs4.BeautifulSoup(data,"html.parser")

def p1_links(page):
    url=get_url(page)
    soup=get_wiki_soup(url)
    #Div with content in it
    content=soup.find("div",id="mw-content-text")
    #First p tag directly under the content div
    paragraphs=content.find_all("p",recursive=False)
    paragraph1=paragraphs[0]

    #If the first paragraph is coordinate info, use the second paragraph.
    firstlink = paragraph1.find("a")
    if "id" in firstlink.parent.attrs and firstlink.parent["id"]=="coordinates":
        paragraph1=paragraphs[1]

    #Find all links from the first paragraph
    links = [link.get("href") for link in paragraph1.find_all("a")]
    #Exclude links that tag points later in the article, and return the page title.
    pagenames = [str(l.split("/")[-1]) for l in links if l.startswith("/wiki/")]
    #Remove files
    pagenames = [pn for pn in pagenames if not pn.startswith("File:")]
    #Remove underscores
    pagenames = [pn.replace("_"," ") for pn in pagenames]
    #Remove fragment identifiers
    pagenames = [pn.rsplit("#")[0] for pn in pagenames]
    #Remove percent codes
    return [urllib2.unquote(pn) for pn in pagenames]



if __name__ == "__main__":
    print p1_links("Wikimedia Foundation")
