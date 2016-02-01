# wikipedia-map
See it at [luke.deentaylor.com/wikipedia](http://luke.deentaylor.com/wikipedia/)

A web app for visualizing the connection of wikipedia pages. Start by entering a topic into the prompt, i.e. *Cats*. A single node will be generated, labeled *Cat*. Double-click this node to expand it.

 Expanding a node creates a new node for each page that  is linked to from the first paragraph of the article. These nodes will be connected to the node from which they were expanded. For example, expanding *Cat* will create eight nodes, including *Fur*, *Mammal*, *Carnivore*, and *Domestication*, each of which will be connected to *Cat*. Each of these nodes can also be expanded in the same way.

 I've chosen to use links only from the first paragraph of an article for 2 reasons:

 1. There is usually a managable number of these links, about 5-10 per page.
 2. They tend to be more directly relevant to the article than links further down in the page.

A map typically looks like this:
 ![](http://i.imgur.com/lnxGNR2.png)
 Note that nodes are lighter in color when they are farther away from the central node. If it took 5 steps to reach *Ancient Greek* from *Penguin*, it will be a lighter color than a node like *Birding*, which only took 2 steps to reach. Thus, in general, a node's color indicates how strongly related to the central topic an article is, with less-strongly related topics having lighter color.

Single-clicking a node will highlight in blue the path back to the central node.
![](http://i.imgur.com/QHduUCc.png)

#How it works

###API
When you double click a node, a request is made to a Flask server (under the `api` directory). The Flask server provides a wrapper around code from my Python script, `wikipedia_parse.py`. The API json-izes the results from `wikipedia_parse.py` and serves them. The resulting API is at [luke.deentaylor.com/wikipedia/api](http://luke.deentaylor.com/wikipedia/api). The main functionality is getting first paragraph links, by making a request like http://luke.deentaylor.com/wikipedia/api/links?page=Cats.

###HTML Parsing
The underlying script, in `wikipedia_parse.py`, uses `BeautifulSoup` to parse through the HTML of wikipedia pages. It looks for the `<div>` element with an `id` of `mw-content-text`, which contains page content. Then, it finds the first `<p>` tag directly under that, excluding the coordinates which are sometimes at the top right. Under this tag, it simply looks at all links, and extracts the page title from each of these links.

###The main page
I suck at JavaScript, which is why I wrote a lot of the underlying code in Python. However, the main page is written mostly in JavaScript. It uses `vis.js` to display the graph. Every time a node is double-clicked, it uses `jQuery` to make an ajax request to the Flask API. The results are word-wrapped with [wordwrap](phpjs.org/functions/wordwrap)), and then stuck on nodes which are colored with [tinycolor](github.com/bgrins/TinyColor) (Honestly, the use of `jQuery`, `tinycolor` and `wordwrap` is *so* trivial that I'll probably just write it out in future versions. I used them temporarily to save me time writing it. :)

#To Do
- [x] single clicking on a node will show a traceback of how you arrived at that node, kind of like breadcrumbs. This will be accomplished by highlighting all nodes and edges taken in blues, instead of oranges.
	- [ ] Only highlight edges directly in the path
- [ ] mobile optimization? Not sure how easy it is with `vis.js`.
- [x] `.gitignore`-ify the libraries directory, no reason for it to be in here when I didn't write that stuff.
- [ ] Remove dependance on wordwrap, jQuery, and tinycolor
- [x] Move JavaScript to separate files from HTML

#Credits
Powered mainly by [vis.js](visjs.org) and [BeautifulSoup](crummy.com/software/BeautifulSoup/), with only minor usage of other libraries ([tinycolor](github.com/bgrins/TinyColor), [jQuery](jquery.com), and [wordwrap](phpjs.org/functions/wordwrap)).
