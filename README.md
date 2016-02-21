# Wikipedia Mapper

See it at [luke.deentaylor.com/wikipedia](http://luke.deentaylor.com/wikipedia/)

A web app for visualizing the connection of wikipedia pages. Start by entering a topic into the text box, i.e. *Cats*. A single node will be generated, labeled *Cat*. Double-click this node to expand it.

Expanding a node creates a new node for each page that  is linked to from the first paragraph of the article. These nodes will be connected to the node from which they were expanded. For example, expanding *Cat* will create eight nodes, including *Fur*, *Mammal*, *Carnivore*, and *Domestication*, each of which will be connected to *Cat*. Each of these nodes can also be expanded in the same way.

I've chosen to use links only from the first paragraph of an article for 2 reasons:

1. There is usually a manageable number of these links, about 5-10 per page.
2. They tend to be more directly relevant to the article than links further down in the page.

A map typically looks something like this:
![](http://i.imgur.com/tJnHSDE.png)
Note that nodes are lighter in color when they are farther away from the central node. If it took 5 steps to reach *Ancient Greek* from *Penguin*, it will be a lighter color than a node like *Birding*, which only took 2 steps to reach. Thus, in general, a node's color indicates how strongly related to the central topic an article is, with less-strongly related topics having lighter color.

Single-clicking a node will highlight in blue the path back to the central node.
![](http://i.imgur.com/1xH3sri.png)
Note that this is not necessarily the shortest path back, but the path that you took to reach the node. Regardless of whether a shorter path back exists, the path by which the node was created will be shown. This is by design.

It has full support for touch devices and mobile browsers:
![](http://i.imgur.com/30TJSBy.jpg)

## Cloning
Note: If you want to clone this, you'll have to replace the `github-markdown.css` file with the file at the link, and you'll have to manually create the `libraries` folder. This repo is designed to reflect only the code that I've actually written, as much as possible.

## How it works

#### API
When you double click a node, a request is made to a Flask server (under the `api` directory). The Flask server provides a wrapper around code from my Python script, `wikipedia_parse.py`. The API json-izes the results from `wikipedia_parse.py` and serves them. The resulting API is at [luke.deentaylor.com/wikipedia/api](http://luke.deentaylor.com/wikipedia/api). The main functionality is getting first paragraph links, by making a request like http://luke.deentaylor.com/wikipedia/api/links?page=Cats.

#### HTML Parsing
The underlying script, in `wikipedia_parse.py`, uses `BeautifulSoup` to parse through the HTML of wikipedia pages. It looks for the `<div>` element with an `id` of `mw-content-text`, which contains page content. Then, it finds the first `<p>` tag directly under that, excluding the coordinates which are sometimes at the top right. Under this tag, it simply looks at all links, and extracts the page title from each of these links.

#### The main page
I suck at JavaScript, which is why I wrote a lot of the underlying code in Python. However, the main page is written mostly in JavaScript. It uses `vis.js` to display the graph. Every time a node is double-clicked, it makes an ajax request to the Flask API. The results are word-wrapped, and then stuck under nodes which are colored according to their distance from the central node. Lighter node colors indicate weaker connections to the central topic.

## To Do

#### Interface
- [x] Build a GUI
  - [x] Change input method to something other than prompt
  - [x] Allow starting anew without refreshing page
  - [x] Create small info button that explains the project, controls, etc.
    - [x] Render this README into the help dialog
    - [x] The area with the network should contain instructions when it is blank
    - [x] Create a more thorough help dialog explaining controls, etc. which also includes the README
  - [x] Add a "Random Article" button
- [ ] While waiting for a node to expand, show a spinner on it to indicate progress is happening

#### Interaction
- [x] single clicking on a node will show a traceback of how you arrived at that node, kind of like breadcrumbs
- [x] mobile optimization: Implement a separate set of controls for touch devices
- [x] On desktop, single-click to expand, hover to highlight path back
- [x] On both desktop and mobile, double-click a node to open the corresponding wikipedia page in a new tab
- [x] Improve efficiency of highlighting the nodes


#### Technical
- [x] `.gitignore`-ify the libraries directory, no reason for it to be in here when I didn't write that stuff
- [x] Remove dependance on some external libraries:
	- [x] jQuery
	- [x] wordwrap
	- [x] tinycolor
- [x] Move JavaScript to separate files from HTML
- [x] Make API requests asynchronous

## Credits
Powered mainly by [vis.js](visjs.org) and [BeautifulSoup](crummy.com/software/BeautifulSoup/).

Rendering of this document into the help modal is done via a modified version of [marked](github.com/chjj/marked) that supports task lists.
