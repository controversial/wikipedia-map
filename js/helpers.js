// This script contains helper functions that are used by other scripts to
// perform common actions.


// -- GLOBAL VARIABLES -- //
var isReset = true;
var selectedNode = null;

// -- HELPER FUNCTIONS -- //


//Get the color for a node, lighten an orange based on level. Subtle.
function getColor(level) {
  var color = tinycolor("fcb587");
  return color.lighten(2*level).toString();
}

//Get the highlighted color for a node, lighten a blue based on level. Subtle.
function getBlueColor(level) {
  var color = tinycolor("87b5fc"); //Note this is orange with RGB reversed.
  return color.lighten(2*level).toString();
}

//Gray-out a node
function grayOut(page) {
  var node = nodes.get(page);
  node.color="#bdbdbd";
  node.gray=true;
  nodes.update(node);
}

//Color a node
function colorNode(node,color) {
  if (!node.gray) {
    node.color=color;
  } else {
    node.color="#bdbdbd"
  }
  nodes.update(node);
  isReset = false;
}


function edgeWidth(edge,width) {
  edge.width = width;
  edges.update(edge);
  isReset = false;
}


//Expand the node for a page
function expandNode(page) {
  var node = nodes.get(page) //The node that was clicked
  var level = node.level + 1 //Level for new nodes is one more than parent
  var subpages = getSubPages(page); //Call python Flask API for subpages

  if (!subpages) {
    grayOut(page);

  } else {

    var subnodes = [];
    var newedges = [];
    //Create node objects
    for (var i=0; i<subpages.length; i++) {
      var subpage = subpages[i];
      if (nodes.getIds().indexOf(subpage) == -1) { //Don't add if node exists
          subnodes.push({id:subpage, label:wordwrap(subpage,15), value:1,
                         level:level, color:getColor(level), parent:page}); //Add node
      }
      var edgeID = page+"-"+subpage
      if (edges.getIds().indexOf(edgeID) == -1) { //Don't create duplicate edges in same direction
        newedges.push({id:page+"-"+subpage, from: page, to: subpage,
                       color:"#C9895F", selectionWidth:0});
      }
    }
    //Add the stuff to the nodes array
    nodes.add(subnodes);
    edges.add(newedges);
  }
}


//Get all the nodes tracing back to the start node.
function getTraceBackNodes(node) {
  var finished = false;
  var startnode = nodes.get(startpage);
  var path = [];
  while (! finished) { //Add parents of nodes until we reach the start
    path.push(node);
    if (node==startpage) { //Check if we've reached the end
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
    var nodeids = nodes.getIds();
    for (var i=0; i<nodeids.length; i++) {
      var node = nodes.get(nodeids[i]);
      var level = node.level;
      colorNode(node,getColor(level));
    }
    //Reset edge width and color
    var edgeids = edges.getIds();
    for (var i=0; i<edgeids.length; i++) {
      var edge = edges.get(edgeids[i]);
      edge.color = "#C9895F";
      edgeWidth(edge,1);
    }
  }
}


//Highlight the path from a given node back to the central node.
function traceBack(node) {
  if (node != selectedNode) {
    selectedNode = node;
    resetProperties();
    var tracenodes = getTraceBackNodes(node);
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
      edge.color = {inherit:"to"}
      edgeWidth(edge,5);
    }
  }
}
