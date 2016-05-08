// Functions for the serialization of a vis.js network. This allows for storing
// a network as JSON and then loading it back later.

function howConcise() {
  // Debugging functions to see the number of characters saved by only including
  // select values in the JSON output.
  var unAbbreviatedLength = JSON.stringify(nodes._data).length +
                            JSON.stringify(edges._data).length +
                            JSON.stringify(startpages).length;
  var abbreviatedLength = networkToJson().length;
  var bytesSaved = unAbbreviatedLength - abbreviatedLength;
  return "Abbreviation takes it from " + unAbbreviatedLength + " bytes unabbreviated" +
         " to " + abbreviatedLength + " bytes abbreviated, for a total of " + bytesSaved +
         " bytes saved!";
}

function abbreviate(node) {
  /* Remove all properties from a node dictionary which can easily be reconstructed

  Omits the following properties:
  - node.id, which is inferred from `label` through `getNeutralId`
  - node.color, which is inferred from `level` through `getColor`
  - node.value, which is inferred from `startpages` (included separately)
  - node.x, which doesn't matter at all for reconstruction
  - node.y, which also doesn't matter at all

  This leaves us with:
  - node.label, which is used to reconstruct node.id
  - node.level, which is used to reconstruct node.color
  - node.parent, which is used to reconstruct the network's edges */

  var newnode = {label: node.label,
                 level: node.level,
                 parent: node.parent,};
  return node;
}

function networkToJson() {
  // Concisely JSON-ize the data needed to quickly reconstruct the network

  var out = {};

  // Store nodes
  var data = nodes._data; // Retreive an object representing nodes data
  var vals = Object.keys(data).map(function(k){return data[k];});
  var abbv = vals.map(function(v){return abbreviate(v);}); // Process it
  out.nodes = abbv; // Store it

  // Store startpages
  out.startpages = startpages;

  return JSON.stringify(out);
}

function networkFromJson() {
  return;
}
