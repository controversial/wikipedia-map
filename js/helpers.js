// This script contains helper functions that are used by other scripts to
// perform simple common actions.


// -- MISCELLANEOUS FUNCTIONS -- //

// Get the level of the highest level node that exists in the graph
function maxLevel() {
  var ids = nodes.getIds();
  levels = ids.map(function(x){return nodes.get(x).level;});
  return Math.max.apply(null, levels);
}

// Convert a hex value to RGB
function hexToRGB(hex) {
  if (hex[0] == "#"){hex = hex.slice(1,hex.length);} // Remove leading #
  strips=[hex.slice(0,2),hex.slice(2,4),hex.slice(4,6)]; // Cut up into 2-digit strips
  return strips.map(function(x){return parseInt(x,16);}); // To RGB
}
function rgbToHex(rgb) {
  var hexvals = rgb.map(function(x){return Math.round(x).toString(16);});
  // Add leading 0s to make a valid 6 digit hex
  hexvals = hexvals.map(function(x){
    return x.length == 1 ? "0"+x : x;
  });
  return "#"+hexvals.join("");
}
// Lighten a given hex color by %
function lightenHex(hex,percent) {
  var rgb = hexToRGB(hex); // Convert to RGB
  if (percent>100) percent=100; //Limit to 100%
  var newRgb = rgb.map(function(x){
    return x+percent/100.0*(255-x); // This works because math.
  });
  return rgbToHex(newRgb); //and back to hex
}
// Get the color for a node, lighten a blue based on level. Subtle.
function getColor(level) {
  return lightenHex("#40C4FF",5*level); // Gets 5% lighter for each level
}
// Get the highlighted color for a node, lighten a yellow based on level. Subtle.
function getYellowColor(level) {
  return lightenHex("#FFC400",5*level); // Gets 5% lighter for each level
}
// Get the color that an edge should be pointing to a certain level
function getEdgeColor(level) {
  var nodecolor = getColor(level);
  return vis.util.parseColor(nodecolor).border;
}


// Break a sentence into separate lines, trying to fit each line within `limit`
// characters. Only break at spaces, never break in the middle of words.
function wordwrap(text,limit) {
  var words = text.split(" ");
  var lines = [""];
  for (var i=0; i<words.length; i++) {
    var word = words[i];
    lastLine = lines[lines.length-1];
    if (lastLine.length + word.length > limit) {
      lines.push(word);
    } else {
      lines[lines.length-1] = lastLine + " " + word;
    }
  }
  return lines.join("\n").trim(); // Trim because the first line will start with a space
}
// Un-word wrap a sentence by replacing line breaks with spaces.
function unwrap(text) {
  return text.replace(/\n/g," ");
}

// Get a "neutral" form of a page name to use as an ID. This is designed to
// minimize the number of duplicate nodes found in the network.
function getNeutralId(id) {
  id = id.toLowerCase(); // Lowercase
  id = id.replace( /%20/g , "" ); // Remove code for spaces
  id = id.replace(/[^A-Za-z\d%]/g, ""); // Remove all non-alphanumeric characters
  if (id[id.length-1] == "s") {
    id = id.slice(0, -1);
  }
  return id;
}

// A cross-browser compatible alternative to Math.sign, because support is atrocious
function sign(x) {
  if (Math.sign) {
    return Math.sign(x);
  } else if (x === 0) {
    return 0;
  } else {
    return x > 0 ? 1:-1;
  }
}


// == NETWORK SHORTCUTS == //

// Color nodes from a list based on their level. If color=1, highlight color will be used.
function colorNodes(ns,color) {
  var colorFunc = color ? getYellowColor : getColor;

  for (var i=0; i<ns.length; i++) {
    ns[i].color=colorFunc(ns[i].level);
    // Prevent snapping
    delete ns[i].x;
    delete ns[i].y;
  }
  nodes.update(ns);
  isReset = false;
}

// Set the width of some edges.
function edgesWidth(es,width) {
  for (var i=0; i<es.length; i++) {
    es[i].width = width;
  }
  edges.update(es);
  isReset = false;
}

// Get the id of the edge connecting two nodes a and b
function getEdgeConnecting(a, b) {
  var edge = edges.get({filter:function(edge) {
    return edge.from === a && edge.to === b;
  }})[0];
  if (edge instanceof Object) {
    return edge.id;
  }
}

// Get the network's center of gravity
function getCenter() {
  var nodePositions = network.getPositions();
  var keys = Object.keys(nodePositions);
  // Find the sum of all x and y values
  var xsum = 0; ysum = 0;
  for (var i=0; i<keys.length; i++) {
    var pos = nodePositions[keys[i]];
    xsum += pos.x;
    ysum += pos.y;
  }
  return [xsum/keys.length, ysum/keys.length]; // Average is sum divided by length
}

// Get the position in which nodes should be spawned given the id of a parent node.
// This position is in place so that nodes begin outside the network instead of at the center,
// leading to less chaotic node openings in large networks.
function getSpawnPosition(parentID) {
  // Get position of the node with specified id.
  var pos = network.getPositions(parentID)[parentID];
  var x = pos.x, y=pos.y;
  var cog = getCenter();
  // Distances from center of gravity to parent node
  var dx = cog[0]-x, dy = cog[1]-y;

  var relSpawnX, relSpawnY;

  if (dx === 0) { // Node is directly above center of gravity or on it, so slope will fail.
    relSpawnX = 0;
    relSpawnY = -sign(dy)*100;
  } else {
    // Compute slope
    var slope = dy/dx;
    // Compute the new node position.
    var dis = 200; // Distance from parent. This should be equal to network.options.physics.springLength;
    relSpawnX = dis / Math.sqrt( Math.pow(slope,2)+1 );
    relSpawnY = relSpawnX * slope;
  }
  return [Math.round(relSpawnX + x), Math.round(relSpawnY + y)];
}
