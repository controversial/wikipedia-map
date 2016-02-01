var startpage = getPageName(prompt("Name of page to start at:"));
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
  if (params.nodes.length) { //Was the click on a node?
    var page = params.nodes[0]; //Name of the page
    var node = nodes.get(page) //The node that was clicked
    var level = node.level + 1 //Level for new nodes is one more than parent
    var subpages = getSubPages(page); //Call python Flask API for subpages

    var subnodes = [];
    var newedges = [];
    //Create node objects
    for (var i=0; i<subpages.length; i++) {
      var subpage = subpages[i];
      if (nodes.getIds().indexOf(subpage) == -1) { //Don't add if node exists
          subnodes.push({id:subpage, label:wordwrap(subpage,15), value:1,
                         level:level, color:getColor(level), parent:page}); //Add node
      }
      newedges.push({from: page, to: subpage}); //TODO expanding a node twice repeats the connections.
    }
    //Add the stuff to the nodes array
    nodes.add(subnodes);
    edges.add(newedges);
  }
});

//Highlight traceback on click
network.on("click", function (params) {
  if (params.nodes.length) { //Was the click on a node?
    //Re-orange all nodes
    orangeAllNodes();

    //Highlight in blue all nodes tracing back to central node
    var page = params.nodes[0]; //Name of the page
    var trace = getTraceBackNodes(page);
    for (var i=0; i<trace.length; i++) {
      var pagename = trace[i];
      var node = nodes.get(pagename); //The node we're iterating on
      var level = node.level;
      node.color = getBlueColor(level);
      nodes.update(node);
    }
  } else {
    orangeAllNodes();
  }
  
});
