// This script contains the code that creates the central network, as well as
// a function for resetting it to a brand new page.


var nodes, edges, network; //Global variables
var startpages = [];
// Tracks whether the network needs to be reset. Used to prevent deleting nodes
// when multiple nodes need to be created, because AJAX requests are async.
var needsreset = true;

var container = document.getElementById('container');
//Global options
var options = {
  nodes: {
    shape: 'dot',
    scaling: { min: 20,max: 30,
      label: { min: 14, max: 30, drawThreshold: 9, maxVisible: 20 }
    },
    font: {size: 14, face: 'Helvetica Neue, Helvetica, Arial'}
  },
  interaction: {
    hover: true,
    hoverConnectedEdges: false,
    selectConnectedEdges: true,
  },
};

var nodes = new vis.DataSet();
var edges = new vis.DataSet();
var data = {nodes:nodes,edges:edges};
var initialized = false;


//Make the network
function makeNetwork() {
  network = new vis.Network(container,data,options);
  bindNetwork();
  initialized=true;
}


// Reset the network to be new each time.
function resetNetwork(start) {
  if (!initialized) makeNetwork();
  var startID = getNeutralId(start);
  startpages = [startID]; // Register the page as an origin node
  tracenodes = [];
  traceedges = [];

  // Change "go" button to a refresh icon
  document.getElementById("submit").innerHTML = '<i class="icon ion-refresh"> </i>';

  // -- CREATE NETWORK -- //
  //Make a container
  nodes = new vis.DataSet([
    {id:startID, label:wordwrap(decodeURIComponent(start),20), value:2, level:0,
     color:getColor(0), x:0, y:0, parent:startID} //Parent is self
  ]);
  edges = new vis.DataSet();
  //Put the data in the container
  data = {nodes:nodes,edges:edges};
  network.setData(data);
}


// Add a new start node to the map.
function addStart(start, index) {
  if (needsreset) {
    // Delete everything only for the first call to addStart by tracking needsreset
    resetNetwork(start);
    needsreset = false;
    return;

  } else {
    var startID = getNeutralId(start);
    startpages.push(startID);
    nodes.add([
      {id:startID, label:wordwrap(decodeURIComponent(start),20), value:2, level:0,
      color:getColor(0), x:0, y:0, parent:startID} // Parent is self
    ]);
  }
}


// Reset the network with the content from the input box.
function resetNetworkFromInput() {
  // Network should be reset
  needsreset = true;
  var cf = document.getElementsByClassName("commafield")[0];
  // Items entered.
  var inputs = getItems(cf);
  // If no input is given, prompt user to enter articles
  if (!inputs[0]) {
    noInputDetected();
    return;
  }

  for (var i=0; i<inputs.length; i++) {
    getPageName(encodeURI(inputs[i])).then(addStart);
  }
}


// Reset the network with one or more random pages.
function randomReset() {
  needsreset = true;
  clearItems(cf);
  // Function to add a single random page to the network as a start.
  var addRandomStart = function() {
    getRandomArticle().then(function(data){
      addStart(data);
      addItem(cf, decodeURIComponent(data));
    });
  };

  if (Math.random() < 0.3) { // 3 in 10 chance of creating multiple nodes
    // Add multiple nodes (2 or 3)
    for (var i=0; i<=Math.ceil(Math.random() * 2); i++) {
      // Unfortunately, random calls need to be at least 1 second apart due to
      // what looks like crappy random algorithms on Wikimedia's end. Even with
      // 1 second, duplicates still occasionally happen, hence the try / catch.
      // I may eventually be able to fix it by implementing my own page
      // randomizer.
      try {
        setTimeout(addRandomStart, 1000*i);
      } catch (e) {}
    }
  } else {
    // Add a single random node (most likely)
    addRandomStart();
  }
}

// Reset the network with content from a JSON string
function resetNetworkFromJson(data) {
  if (!initialized) makeNetwork();
  var obj = networkFromJson(data);
  nodes = obj.nodes;
  edges = obj.edges;
  startpages = obj.startpages;
  // Fill the network
  network.setData({nodes:nodes, edges:edges});
  // Populate the top bar
  for (var i=0; i<startpages.length; i++) {
    addItem(document.getElementById("input"), nodes.get(startpages[i]).label);
  }
  // Transform the "go" button to a "refresh" button
  document.getElementById("submit").innerHTML = '<i class="icon ion-refresh"> </i>';
}
