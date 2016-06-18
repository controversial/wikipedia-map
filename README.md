# Wikipedia Map

A web app for visualizing the connection of wikipedia pages. See it at [luke.deentaylor.com/wikipedia](http://luke.deentaylor.com/wikipedia/)


## Usage
Start by entering a topic into the text box, i.e. *Cats*. A single node will be generated, labeled *Cat*. Click this node to expand it.

Expanding a node creates a new node for each page that is linked to from the first paragraph of the article. These nodes will be connected to the node from which they were expanded. For example, expanding *Cat* will create eight nodes, including *Fur*, *Mammal*, *Carnivore*, and *Domestication*, each of which will be connected to *Cat*. Each of these nodes can also be expanded in the same way.

You can also enter multiple articles to "compare" by pressing Comma, Tab, or Enter after each one. I've built a custom input to give users visual feedback on this style of input, which behaves similarly to many "tag inputs" found elsewhere.

## Showcase

A map typically looks something like this:
![](http://i.imgur.com/tJnHSDE.png)

Wikipedia Map also has full support for touch devices and mobile browsers:
![](http://i.imgur.com/30TJSBy.jpg)


## Cloning
This project depends on a running Flask server to support the Python API. By default, when you clone this, the `api_endpoint` variable (stored in `js/api.js`) will
point to the Flask server on my website. This works fine if you don't want to modify the backend. If you *do* want to change the backend, you will need to:
1. run the Flask server by executing `api/api.py`
2. Change `api_endpoint` in `js/api.js` to point to your running Flask server (typically `localhost:5000`)


## Design choices

#### Functional
I've chosen to use links only from the first paragraph of an article for 2 reasons:

1. There is usually a manageable number of these links, about 5-10 per page.
2. They tend to be more directly relevant to the article than links further down in the page.

#### Visual
Note that nodes are lighter in color when they are farther away from the central node. If it took 5 steps to reach *Ancient Greek* from *Penguin*, it will be a lighter color than a node like *Birding*, which only took 2 steps to reach. Thus, a node's color indicates how closely an article is related to the central topic.

Hovering the mouse over a node will highlight the path back to the central node:
![](http://i.imgur.com/1xH3sri.png)
Note that this is not necessarily the shortest path back, but the path that you took to reach the node. Regardless of whether a shorter path back exists, the path by which the node was created will be shown. This is by design.


## How it works

#### API
When you click to expand a node, a request is made to a Flask server (under the `api` directory). This Flask server exposes code from my Python script, `wikipedia_parse.py`, to JavaScript `XMLHttpRequests`. This Python API parses and json-izes the results of different calls to the Wikipedia API and serves them. The resulting API is at [luke.deentaylor.com/wikipedia/api](http://luke.deentaylor.com/wikipedia/api).

The main functionality is getting "first paragraph links", by making a request like http://luke.deentaylor.com/wikipedia/api/links?page=Cats, but this API also exposes methods like getting the name of a random page (which just consists of a simple wrapper around Wikipedia's API)

#### HTML Parsing
The underlying script, in `wikipedia_parse.py`, uses `BeautifulSoup` to parse through the HTML of wikipedia pages. This HTML is retrieved from calls to Wikipedia's API. The parser looks for the first `<p>` tag (non-recursively to exclude informational content inside divs), and excludes certain special edge cases. Then the parser simply finds all links within this paragraph, excluding ones outside of [the "Main/Article" namespace](https://en.wikipedia.org/wiki/Wikipedia:Namespace). It extracts the page title from each, and returns a list.

#### The main page
I suck at JavaScript, which is why I wrote a lot of the underlying code in Python. However, the front-end is written mostly in JavaScript. I use [`vis.js`](http://visjs.org/) to display the graph. Every time a node is double-clicked, JavaScript makes an AJAX `XMLHttpRequest` to the aforementioned Flask API. The results of the query are word-wrapped, and then stuck under nodes which are colored according to their distance from the central node, as described above.

## To Do

### Stuff I'd like to implement soon(ish)

#### Interface
- [x] Build a GUI
  - [x] Change input method to something other than prompt
  - [x] Allow starting anew without refreshing page
  - [x] Create small info button that explains the project, controls, etc.
    - [x] Render this README into the help dialog
    - [x] The area with the network should contain instructions when it is blank
    - [x] Create a more thorough help dialog explaining controls, etc. which also includes the README
  - [x] Add a "Random Article" button
  - [x] Create a *better* help menu that pops up when a user first visits.
  - [ ] Make the tour better
    - [ ] Show users how to expand and trace back nodes. To do this, create a floating invisible div over a start node. Then, pin the Shepherd step to this div.
    - [ ] Don't allow users to advance to the next step until they've followed the instruction (entering articles, pressing Go)
    - [x] Disappear the info box when the tour is started
- [ ] Redo the whole UI using ~~[Semantic UI](http://semantic-ui.com/)~~ [Bootstrap](http://getbootstrap.com) (Semantic-UI uses jQuery 👿)

- [x] Allow inputting of multiple starts
  - [x] Build an interface for this

#### Interaction
- [x] Hovering over a node will show a traceback of how you arrived at that node, kind of like breadcrumbs
- [x] mobile optimization: Implement a separate set of controls for touch devices
- [x] On both desktop and mobile, double-click (or tap) a node to open the corresponding wikipedia page in a new tab
- [x] Improve efficiency of highlighting the nodes


#### Technical
- [x] `.gitignore`-ify the libraries directory, no reason for it to be in here when I didn't write that stuff
- [x] Remove dependance on some external libraries:
	- [x] jQuery
	- [x] wordwrap
	- [x] tinycolor
- [x] Move JavaScript to separate files from HTML
- [x] Make API requests asynchronous
- [ ] Add some kind of build system to make building local copies and contributing easier

### Stuff it might be nice to implement sometime in the far future
- [ ] Autocomplete names of Wikipedia articles in the top bar
- [ ] Make the size of nodes reflect the number of backlinks
- [ ] Support for other languages
- [ ] Support for other MediaWiki wikis


## Credits
This project is powered by Wikipedia! Wikipedia is one of my favorite things, and its wealth of information makes this project possible.

The technical bits are mostly powered just by  [`vis.js`](http://visjs.org) and [`BeautifulSoup`](http://crummy.com/software/BeautifulSoup/).

Rendering of this document into the help modal is done via a modified version of [`marked`](github.com/chjj/marked) that supports task lists.

The colors used in the network come from the [material design color palette](https://material.google.com/style/color.html#color-color-palette). Specifically, the yellow is "Amber A400" (`#FFC400`) and the blue is "Light Blue A200" (`#40C4FF`). Note that the colors *are* adjusted algorithmically, so these colors are only used as a base.
