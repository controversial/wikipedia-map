// Functions for the serialization of a vis.js network. This allows for storing
// a network as JSON and then loading it back later.



// GLOBALS //

// In abbreviated JSON data, these replacements are used to keep the data short
var abbvReplacements = {
  a: "label",
  b: "value",
  c: "parent"
};



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

//Remove all properties from a node dictionary which can easily be reconstructed
function abbreviate(node) {
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

// Concisely JSON-ize the data needed to quickly reconstruct the network
function networkToJson() {
  var out = {};

  // Store nodes
  var data = nodes._data; // Retreive an object representing nodes data
  var vals = Object.keys(data).map(function(k){return data[k];});
  var abbv = vals.map(abbreviate); // Process it
  out.nodes = abbv; // Store it

  // Store startpages
  out.startpages = startpages;

  return JSON.stringify(out);
}



// DESERIALIZATION METHODS //

// Unabbreviate values
function unabbreviate(node, startpgs) {
  var newnode = {label: node.a,
                 level: node.b,
                 parent: node.c};
  // Infer omitted properties
  newnode.id = getNeutralId(newnode.label);
  newnode.color = getColor(newnode.level);
  newnode.value = startpgs.indexOf(newnode.id) === -1 ? 1:2;
  return newnode;
}

// Reconstruct edges given a list of nodes
function buildEdges (nds) {
  var edgs = new vis.DataSet();
  for (var i = 0; i < nds.length; i++) {
    node = nds[i];
    if (node.parent != node.id) {
      edgs.add({from: node.parent, to: node.id, color: getEdgeColor(node.level),
                selectionWidth: 2, hoverWidth:0});
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
  var expandedNodes = nds.map(function(x){return unabbreviate(x, out.startpages);});
  out.nodes = new vis.DataSet();
  out.nodes.add(expandedNodes);
  // Store edges
  out.edges = buildEdges(expandedNodes);

  return out;
}
