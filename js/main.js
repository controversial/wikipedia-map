// This script contains the code that creates the central network, as well as
// a function for resetting it to a brand new page.


var nodes, edges, startpage, network //Global variables


// Is the user on a touch device?
var isTouchDevice = 'ontouchstart' in document.documentElement;

var container = document.getElementById('container');
//Global options
var options = {
  nodes: {
    shape: 'dot',
    scaling: { min: 20,max: 30,
      label: { min: 14, max: 30, drawThreshold: 9, maxVisible: 20 }
    },
    font: {size: 12, face: 'Arial'}
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
var initialized = false


//Make the network
function makeNetwork() {
  network = new vis.Network(container,data,options);
  bindNetwork();
  initialized=true;
}


//Reset the network to be new each time.
function resetNetwork(start) {
  if (!initialized){makeNetwork()};
  startpage = start;
  tracenodes = [];
  traceedges = [];
  // -- CREATE NETWORK -- //
  //Make a container
  nodes = new vis.DataSet([
    {id:startpage, label:wordwrap(decodeURIComponent(startpage),20), value:2, level:0,
     color:getColor(0), parent:startpage} //Parent is self
  ]);
  edges = new vis.DataSet();
  //Put the data in the container
  data = {nodes:nodes,edges:edges};
  network.setData(data);
}
