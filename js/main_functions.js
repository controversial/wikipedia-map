// This script contains the big functions that implement a lot of the core
// functionality, like expanding nodes, and getting the nodes for a traceback.


// -- GLOBAL VARIABLES -- //
var isReset = true;
var selectedNode = null;
var traceedges = [];
var tracenodes = [];
// ---------------------- //


// AJAX callback to add to a node once data is recieved
function expandNodeCallback(page,data) {
  var node = nodes.get(page) //The node that was clicked
  var level = node.level + 1 //Level for new nodes is one more than parent
  var subpages = data; //Data returned from AJAX call

  if (!subpages) {
    grayOut(page);

  } else {

    var subnodes = [];
    var newedges = [];
    //Create node objects
    for (var i=0; i<subpages.length; i++) {
      var subpage = subpages[i];
      if (nodes.getIds().indexOf(subpage) == -1) { //Don't add if node exists
          subnodes.push({id:subpage, label:wordwrap(decodeURIComponent(subpage),15), value:1,
                         level:level, color:getColor(level), parent:page}); //Add node
      }
      var edgeID = page+"-"+subpage
      if (edges.getIds().indexOf(edgeID) == -1) { //Don't create duplicate edges in same direction
        newedges.push({id:page+"-"+subpage, from: page, to: subpage,
                       color:getEdgeColor(level),selectionWidth:2, hoverWidth:0});
      }
    }
    //Add the stuff to the nodes array
    nodes.add(subnodes);
    edges.add(newedges);
  }
}
//Expand a node without freezing other stuff
function expandNode(page) {
  getSubPages(page,
    function(data) {expandNodeCallback(page,data)});
}

//Get all the nodes tracing back to the start node.
function getTraceBackNodes(node) {
  var finished = false;
  var path = [];
  while (! finished) { //Add parents of nodes until we reach the start
    path.push(node);
    if (startpages.indexOf(node) !== -1) { //Check if we've reached the end
      finished = true;
    }
    node = nodes.get(node).parent; //Keep exploring with the node above.
  }
  return path;
}

//Get all the edges tracing back to the start node.
function getTraceBackEdges(tbnodes) {
  tbnodes.reverse();
  var path = [];
  for (var i=0; i<tbnodes.length-1; i++) { //Don't iterate through the last node
    path.push(tbnodes[i]+"-"+tbnodes[i+1]);
  }
  return path;
}

//Reset the color of all nodes, and width of all edges.
function resetProperties() {
  if (!isReset) {
    selectedNode = null;
    //Reset node color
    var nodeids = tracenodes;
    for (var i=0; i<nodeids.length; i++) {
      var node = nodes.get(nodeids[i]);
      var level = node.level;
      colorNode(node,getColor(level));
    }
    //Reset edge width and color
    var edgeids = traceedges;
    for (var i=0; i<edgeids.length; i++) {
      var edge = edges.get(edgeids[i]);
      edge.color = getEdgeColor(nodes.get(edge.to).level);
      edgeWidth(edge,1);
    }
    tracenodes = [];
    traceedges = [];
  }
}

//Highlight the path from a given node back to the central node.
function traceBack(node) {
  if (node != selectedNode) {
    selectedNode = node;
    resetProperties();
    tracenodes = getTraceBackNodes(node);
    traceedges = getTraceBackEdges(tracenodes);
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
      edge.color = {inherit:"to"}
      edgeWidth(edge,5);
    }
  }
}
