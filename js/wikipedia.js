var startpage = getPageName(prompt("Name a wikipedia page:"));
startpage = wordwrap(startpage,20)


// -- CREATE NETWORK -- //
//Make a container
var nodes = new vis.DataSet([{id:startpage,label:startpage,
                              value:2,level:0,color:getColor(0),
                              parent:startpage}]); //Parent is self
var edges = new vis.DataSet();
//Put the data in the container
var data = {nodes:nodes,edges:edges};
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
};
//Make the network
var network = new vis.Network(container,data,options);


// -- ACTIONS -- //

//Open a node when clicked
network.on("doubleClick", function (params) {
  if (params.nodes.length) { //Did the click occur on a node?
    var page = params.nodes[0]; //Name of the page
    expandNode(page);
  }
});

//Highlight traceback on click
network.on("click", function (params) {
  if (params.nodes.length) { //Was the click on a node?
    //Re-orange all nodes
    resetProperties();

    //Highlight in blue all nodes tracing back to central node
    var page = params.nodes[0]; //Name of the page
    var tracenodes = getTraceBackNodes(page);
    var traceedges = getTraceBackEdges(tracenodes);
    //Color nodes blue
    for (var i=0; i<tracenodes.length; i++) {
      var pagename = tracenodes[i];
      var node = nodes.get(pagename); //The node we're iterating on
      var level = node.level;
      colorNode(node, getBlueColor(level));
    }
    //Widen edges
    for (var i=0; i<traceedges.length; i++) {
      var edgeid = traceedges[i];
      var edge = edges.get(edgeid); //The node we're iterating on
      edge.width=5;
      edges.update(edge);
    }
  } else {
    resetProperties();
  }
});
