/* global vis, bindNetwork, getNormalizedId, wordwrap, getColor, noInputDetected, getItems, addItem, clearItems, unlockAll, fetchPageTitle, getRandomArticle, networkFromJson */ // eslint-disable-line max-len
// This script contains the code that creates the central network, as well as
// a function for resetting it to a brand new page.


let nodes;
let edges;
let network; // Global variables

window.startpages = [];
// Tracks whether the network needs to be reset. Used to prevent deleting nodes
// when multiple nodes need to be created, because AJAX requests are async.

const container = document.getElementById('container');
// Global options
const options = {
  nodes: {
    shape: 'dot',
    scaling: {
      min: 20,
      max: 30,
      label: { min: 14, max: 30, drawThreshold: 9, maxVisible: 20 },
    },
    font: { size: 14, face: getComputedStyle(document.body).fontFamily },
  },
  interaction: {
    hover: true,
    hoverConnectedEdges: false,
    selectConnectedEdges: true,
  },
};

nodes = new vis.DataSet();
edges = new vis.DataSet();
let data = { nodes, edges };
let initialized = false;


// Set up the network
function makeNetwork() {
  if (initialized) throw new Error('Network is already initialized');
  network = new vis.Network(container, data, options);
  bindNetwork();

  window.startpages = [];
  window.tracenodes = [];
  window.traceedges = [];
  nodes = new vis.DataSet();
  edges = new vis.DataSet();
  data = { nodes, edges };
  network.setData(data);

  initialized = true;
}

// Get the object to represent a "start node" for a given page name
const getStartNode = pageName => ({
  id: getNormalizedId(pageName),
  label: wordwrap(decodeURIComponent(pageName), 20),
  value: 2,
  level: 0,
  color: getColor(0),
  x: 0,
  y: 0,
  parent: getNormalizedId(pageName), // Parent is self
});

// Reset everything to its initial state
function clearNetwork() {
  window.startpages = [];
  window.tracenodes = [];
  window.traceedges = [];
  nodes = new vis.DataSet();
  edges = new vis.DataSet();
  data = { nodes, edges };
  network.setData(data);

  const cf = document.getElementById('input');
  unlockAll(cf);
}

// Add and remove "start nodes" to make the list of start nodes match the list passed
function setStartPages(starts) {
  const newStartPages = starts.map(getNormalizedId);
  if (!initialized) makeNetwork();
  const toRemove = window.startpages.filter(id => !newStartPages.includes(id));
  const toAdd = starts.filter((pageName, i) => !window.startpages.includes(newStartPages[i]));

  nodes.remove(toRemove);
  nodes.add(toAdd.map(getStartNode));
  window.startpages = newStartPages;
}


// Reset the network with the content from the input box.
function go() {
  // Get items entered
  const cf = document.getElementById('input');
  const inputs = getItems(cf);
  // If no input is given, prompt user to enter articles
  if (!inputs[0]) {
    noInputDetected();
    return;
  }

  Promise.all(inputs.map(fetchPageTitle))
    .then((pageTitles) => {
      // Record on the commafield item which node the input corresponds to
      pageTitles.forEach((pageTitle, i) => {
        cf.getElementsByClassName('item')[i].dataset.nodeId = getNormalizedId(pageTitle);
      });
      // Make the network‘s start pages the pages from the inputs
      setStartPages(pageTitles);
    });

  // Show 'clear' button
  document.getElementById('clear').style.display = '';
}


// Reset the network with one or more random pages.
function goRandom() {
  const cf = document.getElementsByClassName('commafield')[0];
  getRandomArticle().then((ra) => {
    addItem(cf, decodeURIComponent(ra));
    go();
  });
}

// Reset the network with content from a JSON string
function resetNetworkFromJson(j) {
  if (!initialized) makeNetwork();
  clearNetwork();
  const obj = networkFromJson(j);
  nodes = obj.nodes;
  edges = obj.edges;
  window.startpages = obj.startpages;
  // Fill the network
  network.setData({ nodes, edges });
  // Populate the top bar
  const cf = document.getElementById('input');
  clearItems(cf);
  window.startpages.forEach((sp) => {
    console.log(sp, nodes.get(sp));
    addItem(cf, nodes.get(sp).label.replace(/\s+/g, ' '));
    // TODO: set node IDs on commafield items
    // TODO: lock commafield items that have been expanded
  });
}
