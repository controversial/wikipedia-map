// Functions for the serialization of a vis.js network. This allows for storing
// a network as JSON and then loading it back later.


// DEBUGGING FUNCTIONS //

// Debugging function to see the number of characters saved by only including
// select values in the JSON output. This helps me assess the efficiency of my
// abbreviation method.
function howConcise() {
  // Length of all the data if no abbre
  var unAbbreviatedLength = JSON.stringify(nodes._data).length +
                            JSON.stringify(edges._data).length +
                            JSON.stringify(startpages).length;
  var abbreviatedLength = networkToJson().length;
  var bytesSaved = unAbbreviatedLength - abbreviatedLength;
  var percentSaved = bytesSaved/unAbbreviatedLength * 100;
  var averageSize = abbreviatedLength/nodes.length;
  console.log("Abbreviation takes JSON size from " + unAbbreviatedLength +
               " bytes (unabbreviated) to " + abbreviatedLength + " bytes (abbreviated)");
  console.log("Saves a total of " + bytesSaved + " bytes (" + percentSaved+ " percent)");
  console.log("Average size of " + averageSize + " bytes per node");
}



// SERIALIZATION METHODS //

// Get all the edges that are not directly from a node to its parent. These
// are formed at all cases in which expanding a node links it to a pre-existing
// node.
function getFloatingEdges() {
  floatingEdges = [];
  edges.forEach(function(edge) {
    if (nodes.get(edge.to).parent != edge.from) {
      floatingEdges.push(edge);
    }
  });
  return floatingEdges;
}

//Remove all properties from a node Object which can easily be reconstructed
function abbreviateNode(node) {
  /* Omits the following properties:
  - node.id, which is inferred from `label` through `getNeutralId`
  - node.color, which is inferred from `level` through `getColor`
  - node.value, which is inferred from `startpages` (included separately)
  - node.x, which doesn't matter at all for reconstruction
  - node.y, which also doesn't matter at all

  This leaves us with:
  - node.label, which is used to reconstruct node.id
  - node.level, which is used to reconstruct node.color
  - node.parent, which is used to reconstruct the network's edges */

  var newnode = {a: node.label,
                 b: node.level,
                 c: node.parent};
  return newnode;
}

// Remove all properties from an edge Object which can be easily reconstructed
function abbreviateEdge(edge) {
  /* Omits the following properties:
  - edge.color, which is inferred from nodes.get(edge.to).color
  - edge.selectionWidth, which is always 2
  - edge.hoverWidth, which is always 0
  */
  var newedge = {a: edge.from,
                 b: edge.to,
                 c: edge.level};
  return newedge;
}

// Concisely JSON-ize the data needed to quickly reconstruct the network
function networkToJson() {
  var out = {};

  // Store nodes
  var data = nodes._data; // Retreive an object representing nodes data
  var vals = Object.keys(data).map(function(k){return data[k];});
  var abbv = vals.map(abbreviateNode); // Process it
  out.nodes = abbv; // Store it

  // Store startpages
  out.startpages = startpages;

  // Store floating edges
  out.edges = getFloatingEdges();

  return JSON.stringify(out);
}



// DESERIALIZATION METHODS //

// Unabbreviate a node Object
function unabbreviateNode(node, startpgs) {
  // Make quick substitutions
  var newnode = {label: node.a,
                 level: node.b,
                 parent: node.c};
  // Infer omitted properties
  newnode.id = getNeutralId(newnode.label);
  newnode.color = getColor(newnode.level);
  newnode.value = startpgs.indexOf(newnode.id) === -1 ? 1:2;

  return newnode;
}

// Unabbreviate an edge Object.
function unabbreviateEdge(edge) {
  var newedge = {from: edge.a,
                 to: edge.b,
                 level: edge.c};
  newedge.color = getEdgeColor(newedge.level);
  newedge.selectionWidth = 2;
  newedge.hoverWidth = 0;

  return newedge;
}

// Reconstruct edges given a list of nodes
function buildEdges (nds) {
  var edgs = new vis.DataSet();
  for (var i = 0; i < nds.length; i++) {
    node = nds[i];
    if (node.parent != node.id) { // Don't create an edge from start nodes to themselves
      edgs.add({from: node.parent, to: node.id, color: getEdgeColor(node.level),
                level: node.level, selectionWidth: 2, hoverWidth:0});
    }
  }
  return edgs;
}

// Take consise JSON and use it to reconstruct `nodes` and `edges`
function networkFromJson(data) {
  // Get data
  data = JSON.parse(data);

  out = {};

  // Store startpages
  out.startpages = data.startpages;
  // Store nodes
  var nds = data.nodes;
  var expandedNodes = nds.map(function(x){return unabbreviateNode(x, out.startpages);});
  out.nodes = new vis.DataSet();
  out.nodes.add(expandedNodes);
  // Store edges
  out.edges = buildEdges(expandedNodes);
  out.edges.add(data.edges);

  return out;
}
