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
  var node = nodes.get(page); //The node that was clicked
  var level = node.level + 1; //Level for new nodes is one more than parent
  var subpages = data; //Data returned from AJAX call

  // Add all children to network
  var subnodes = [];
  var newedges = [];
  // Where new nodes should be spawned
  var nodeSpawn = getSpawnPosition(page);
  //Create node objects
  for (var i=0; i<subpages.length; i++) {
    var subpage = subpages[i];
    var subpageID = getNeutralId(subpage);
    if (nodes.getIds().indexOf(subpageID) == -1) { //Don't add if node exists
        subnodes.push({id:subpageID, label:wordwrap(decodeURIComponent(subpage),15), value:1,
                       level:level, color:getColor(level), parent:page,
                       x:nodeSpawn[0], y:nodeSpawn[1]}); //Add node
    }
    var edgeID = page+"-"+subpageID;
    if (edges.getIds().indexOf(edgeID) == -1) { //Don't create duplicate edges in same direction
      newedges.push({id:edgeID, from: page, to: subpageID,
                     color:getEdgeColor(level),selectionWidth:2, hoverWidth:0});
    }
  }
  //Add the stuff to the nodes array
  nodes.add(subnodes);
  edges.add(newedges);

}
//Expand a node without freezing other stuff
function expandNode(page) {
  var label = nodes.get(page).label;
  var pagename = encodeURIComponent(unwrap(label));
  getSubPages(pagename,
    function(data) {expandNodeCallback(page,data);});
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
    var modnodes = tracenodes.map(function(i){return nodes.get(i);});
    colorNodes(modnodes, 0);
    //Reset edge width and color
    var modedges = traceedges.map(function(i){
      var e=edges.get(i);
      e.color=getEdgeColor(nodes.get(e.to).level);
      return e;
    });
    edgesWidth(modedges, 1);
    tracenodes = [];
    traceedges = [];
  }
}

//Highlight the path from a given node back to the central node.
function traceBack(node) {
  if (node != selectedNode) {
    //console.time("trace");
    selectedNode = node;
    resetProperties();
    tracenodes = getTraceBackNodes(node);
    traceedges = getTraceBackEdges(tracenodes);
    //Color nodes yellow
    var modnodes = tracenodes.map(function(i){return nodes.get(i);});
    colorNodes(modnodes, 1);
    //Widen edges
    var modedges = traceedges.map(function(i){
      var e=edges.get(i);
      e.color={inherit:"to"};
      return e;
    });
    edgesWidth(modedges, 5);
   // console.timeEnd("trace");
  }
}
