// This script contains helper functions that are used by other scripts to
// perform simple common actions.


// -- MISCELLANEOUS FUNCTIONS -- //

//Get the level of the highest level node that exists in the graph
function maxLevel() {
  var ids = nodes.getIds();
  levels = ids.map(function(x){return nodes.get(x).level});
  return Math.max.apply(null, levels);
}

//Convert a hex value to RGB
function hexToRGB(hex) {
  if (hex[0] == "#"){hex = hex.slice(1,hex.length)} // Remove leading #
  strips=[hex.slice(0,2),hex.slice(2,4),hex.slice(4,6)]; // Cut up into 2-digit strips
  return strips.map(function(x){return parseInt(x,16)}); // To RGB
}
function rgbToHex(rgb) {
  var hexvals = rgb.map(function(x){return Math.round(x).toString(16)});
  // Add leading 0s to make a valid 6 digit hex
  hexvals = hexvals.map(function(x){
    if (x.length == 1) {return ("0"+x)} else {return x}
  })
  return "#"+hexvals.join("");
}
// Lighten a given hex color by %
function lightenHex(hex,percent) {
  var rgb = hexToRGB(hex); // Convert to RGB
  if (percent>100){percent=100;}; //Limit to 100%
  var newRgb = rgb.map(function(x){
    return x+percent/100.0*(255-x); // This works because math.
  });
  return rgbToHex(newRgb); //and back to hex
}

//Get the color for a node, lighten an orange based on level. Subtle.
function getColor(level) {
  return lightenHex("#40C4FF",5*level); //Gets 10% lighter for each level
}

//Get the highlighted color for a node, lighten a blue based on level. Subtle.
function getBlueColor(level) {
  return lightenHex("#FFC400",5*level); //Gets 10% lighter for each level
}

function wordwrap(text,limit) {
  var words = text.split(" ");
  var lines = [""];
  for (var i=0; i<words.length; i++) {
    var word = words[i]
    lastLine = lines[lines.length-1];
    if (lastLine.length + word.length > limit) {
      lines.push(word);
    } else {
      lines[lines.length-1] = lastLine + " " + word;
    }
  }
  return lines.join("\n")
}


// == NETWORK SHORTCUTS == //
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

//Set the width of an edge
function edgeWidth(edge,width) {
  edge.width = width;
  edges.update(edge);
  isReset = false;
}
