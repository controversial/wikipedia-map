# Wikipedia Map

![](http://i.imgur.com/fTzzl0k.png)

A web app for visualizing the connection of wikipedia pages. See it at [luke.deentaylor.com/wikipedia](http://luke.deentaylor.com/wikipedia/)


## Usage
Start by entering a topic into the text box, i.e. *Cats*. A single node will be generated, labeled *Cat*. Click this node to expand it.

Expanding a node creates a new node for each page that is linked to from the first paragraph of the article. These nodes will be connected to the node from which they were expanded. For example, expanding *Cat* will create eight nodes, including *Fur*, *Mammal*, *Carnivore*, and *Domestication*, each of which will be connected to *Cat*. Each of these nodes can also be expanded in the same way.

You can also enter multiple articles to "compare" by pressing Comma, Tab, or Enter after each one. I've built a custom input to give users visual feedback on this style of input, which behaves similarly to many "tag inputs" found elsewhere.

## Showcase

A map typically looks something like this:
![Wikipedia Map](http://i.imgur.com/RCH89TL.png)

Wikipedia Map also has full support for touch devices and mobile browsers:
![](http://i.imgur.com/30TJSBy.jpg)


## Cloning
To use the app locally, simply
```bash
git clone https://github.com/controversial/wikipedia-map/
```
and open `index.html` in a web browser. No compilation or server is necessary to run the front-end.

This project depends on a Node.js server which serves a back-end API using `express`. In this configuration, all requests to the back-end will still be made to an externally hosted back-end. If you want to modify the backend of your local copy, you will need to:
1. `npm install` inside the `api` folder to install required dependencies
2. Run `node index.js` (also inside the `api` folder)
2. Change the line 9 in `js/api.js` to point to the Node.js server:
```js
var api_endpoint = "http://localhost:3000/";
```


## Design choices

#### Functional
I've chosen to use links only from the first paragraph of an article for 2 reasons:

1. There is usually a manageable number of these links, about 5-10 per page.
2. They tend to be more directly relevant to the article than links further down in the page.

#### Visual
Note that nodes are lighter in color when they are farther away from the central node. If it took 5 steps to reach *Ancient Greek* from *Penguin*, it will be a lighter color than a node like *Birding*, which only took 2 steps to reach. Thus, a node's color indicates how closely an article is related to the central topic.

Hovering the mouse over a node will highlight the path back to the central node:
![Traceback](http://i.imgur.com/G7sV5AX.png)
Note that this is not necessarily the shortest path back, but the path that you took to reach the node. Regardless of whether a shorter path back exists, the path by which the node was created will be shown. This is by design.


## How it works

#### Server
When you click to expand a node, a request is made to a Node.js server (found in the `api` directory). This server is an interface between front-end JavaScript `XMLHttpRequest`s and the back-end, which is responsible for downloading and parsing Wikipedia articles. The Node.js server performs requests to the Wikipedia API, processes the responses, and serves digested content to the user. The API runs in production at [wikipedia-map.now.sh](https://wikipedia-map.now.sh) (try [/links?page=Cat](https://wikipedia-map.now.sh/links?page=Cat))

The main functionality of the server is to extract "first paragraph links" from articles, in response to requests like `GET http://luke.deentaylor.com/wikipedia/api/links?page=Cats`. The server also exposes endpoints for actions like retrieving a randomized page name.

#### HTML Parsing
`wikipedia_parse.js` uses [`cheero`](https://github.com/cheeriojs/cheerio) to parse wikipedia pages’ HTML, which is retrieved from calls to Wikipedia's API. The parser looks for the first first paragraph’s `<p>` tag (considering some edge cases), and extracts all of the `<a>` links within this paragraph. It excludes links outside of [the "Main/Article" namespace](https://en.wikipedia.org/wiki/Wikipedia:Namespace) to ensure all links returned are links to valid Wikipedia articles.

#### The main page
The front-end uses [`vis.js`](http://visjs.org/) to display the graph. Every time a node is clicked, the app makes a `XMLHttpRequest` to the Node.js server. The resulting links are added as new nodes, colored according to their distance from the central node (as described above).

## Roadmap

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
- [x] Allow inputting of multiple starts
  - [x] Build an interface for this
- [ ] Implement saving + sharing
  - [x] Saving a graph
  - [x] Loading a graph from an id
  - [x] Loading a graph from a URL parameter
  - [ ] Implement sharing UI

#### Interaction
- [x] Hovering over a node will show a traceback of how you arrived at that node, kind of like breadcrumbs
- [x] mobile optimization: Implement a separate set of controls for touch devices
- [x] On both desktop and mobile, double-click (or tap) a node to open the corresponding wikipedia page in a new tab
- [ ] Improve efficiency of highlighting the nodes


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

The colors used in the network come from the [material design color palette](https://material.google.com/style/color.html#color-color-palette). Specifically, I got them from [here](http://www.materialpalette.com/light-blue/amber).
