/* global vis, bindNetwork, getNeutralId, wordwrap, getColor, noInputDetected, getItems, clearItems, addItem, fetchPageTitle, getRandomArticle, networkFromJson */ // eslint-disable-line max-len
// This script contains the code that creates the central network, as well as
// a function for resetting it to a brand new page.


let nodes;
let edges;
let network; // Global variables

let startpages = [];
// Tracks whether the network needs to be reset. Used to prevent deleting nodes
// when multiple nodes need to be created, because AJAX requests are async.
let needsreset = true;

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
    font: { size: 14, face: 'Helvetica Neue, Helvetica, Arial' },
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


// Make the network
function makeNetwork() {
  network = new vis.Network(container, data, options);
  bindNetwork();
  initialized = true;
}


// Reset the network to be new each time.
function resetNetwork(start) {
  if (!initialized) makeNetwork();
  const startID = getNeutralId(start);
  startpages = [startID]; // Register the page as an origin node
  window.tracenodes = [];
  window.traceedges = [];

  // Change "go" button to a refresh icon
  document.getElementById('submit').innerHTML = '<i class="icon ion-refresh"> </i>';

  // -- CREATE NETWORK -- //
  // Make a container
  nodes = new vis.DataSet([
    {
      id: startID,
      label: wordwrap(decodeURIComponent(start), 20),
      value: 2,
      level: 0,
      color: getColor(0),
      x: 0,
      y: 0,
      parent: startID,
    }, // Parent is self
  ]);
  edges = new vis.DataSet();
  // Put the data in the container
  data = { nodes, edges };
  network.setData(data);
}


// Add a new start node to the map.
function addStart(start, index) {
  if (needsreset) {
    // Delete everything only for the first call to addStart by tracking needsreset
    resetNetwork(start);
    needsreset = false;
  } else {
    const startID = getNeutralId(start);
    startpages.push(startID);
    nodes.add([
      {
        id: startID,
        label: wordwrap(decodeURIComponent(start), 20),
        value: 2,
        level: 0,
        color: getColor(0),
        x: 0,
        y: 0,
        parent: startID, // Parent is self
      },
    ]);
  }
}


// Reset the network with the content from the input box.
function resetNetworkFromInput() {
  // Network should be reset
  needsreset = true;
  const cf = document.getElementsByClassName('commafield')[0];
  // Items entered.
  const inputs = getItems(cf);
  // If no input is given, prompt user to enter articles
  if (!inputs[0]) {
    noInputDetected();
    return;
  }

  inputs.forEach(inp => fetchPageTitle(encodeURI(inp)).then(addStart));
}


// Reset the network with one or more random pages.
function randomReset() {
  needsreset = true;
  const cf = document.getElementsByClassName('commafield')[0];
  clearItems(cf);
  // Function to add a single random page to the network as a start.
  const addRandomStart = () => {
    getRandomArticle().then((ra) => {
      addStart(ra);
      addItem(cf, decodeURIComponent(ra));
    });
  };

  if (Math.random() < 0.3) { // 3 in 10 chance of creating multiple nodes
    // Add multiple nodes (2 or 3)
    for (let i = 0; i <= Math.ceil(Math.random() * 2); i += 1) {
      // Unfortunately, random calls need to be at least 1 second apart due to
      // what looks like crappy random algorithms on Wikimedia's end. Even with
      // 1 second, duplicates still occasionally happen, hence the try / catch.
      // I may eventually be able to fix it by implementing my own page
      // randomizer.
      try {
        setTimeout(addRandomStart, i * 1000);
      } catch (e) {}
    }
  } else {
    // Add a single random node (most likely)
    addRandomStart();
  }
}

// Reset the network with content from a JSON string
function resetNetworkFromJson(j) {
  if (!initialized) makeNetwork();
  const obj = networkFromJson(j);
  nodes = obj.nodes;
  edges = obj.edges;
  startpages = obj.startpages;
  // Fill the network
  network.setData({ nodes, edges });
  // Populate the top bar
  startpages.forEach((sp) => {
    addItem(document.getElementById('input'), nodes.get(sp).label);
  });
  // Transform the "go" button to a "refresh" button
  document.getElementById('submit').innerHTML = '<i class="icon ion-refresh"> </i>';
}
