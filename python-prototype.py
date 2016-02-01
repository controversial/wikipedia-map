"""This is my original code, which I spent about 2 hours on. I thought I'd
include it just for fun. As you can see, the code has been completely rewritten
since this version. the `wikipedia` module only provides support for getting all
page links. Once I decided I wanted to work with only the first-paragraph links,
I wrote my own implementation in BeautifulSoup. This version generates a static
PNG. I think an interactive JavaScript front-end is much more fun ;)
"""


# Scrapes wikipedia. Start with the name of a page. Then, it will click the first
# 5 links on this page. For each of these links, it will click the first 5 links
# on *that* page. It will not stray more than 5 pages away from the start page.
# These attributes can be adjusted by changing BREADTH and MAXDEPTH. This script
# will output a PNG file of your wikipedia map.

#REQUIREMENTS: `wikipedia` and `pydot`

import wikipedia as wp
import pydot

def ascii(inp):
    return str(inp.encode("ascii",errors="ignore"))

class WikiScraper:
    def __init__(self, startpage,maxbreadth=10):
        self.startpage=startpage
        self.maxbreadth=maxbreadth
        self.maxdepth=0

        self.visited = set()

        self.graph=pydot.Dot()

    def connect(self,parent,children):
        self.visited.add(parent)
        for child in children:
            edge=pydot.Edge(ascii(parent),ascii(child))
            self.graph.add_edge(edge)

    def pickLinks(self,page,n):
        """Pick `n` links from page."""
        links=page.links
        indices=range(1,len(links),len(links)/n)
        return [links[i] for i in indices]

    def explore(self,pagename,depth):
        #Return if we've exceeded max depth.
        if depth==self.maxdepth:
            return
        #Return if we've already visited a page
        if pagename in self.visited:
            return

        try:
            page=wp.page(pagename)
        except wp.exceptions.DisambiguationError:
            #Return in the event of reaching a disambiguation page
            return
        except wp.exceptions.PageError:
            #We've tried to find a page that doesn't exist
            print "The page {} could not be found".format(pagename.encode("utf-8"))
            return

        print "Exploring \""+pagename.encode("utf-8")+"\" at depth "+str(depth)

        links=self.pickLinks(page,self.maxbreadth)

        self.connect(pagename,links)

        for link in links:
            self.explore(link,depth+1)

    def start(self,maxdepth=0):
        self.maxdepth=maxdepth
        self.explore(self.startpage,1)

if __name__ == "__main__":
    STARTPAGE="Cats"
    BREADTH=5
    MAXDEPTH=5
    w=WikiScraper(STARTPAGE,BREADTH)
    w.start(MAXDEPTH)
    w.graph.write(STARTPAGE+".dot")
