// This script contains helper functions that are used by other scripts to
// perform simple common actions.


// -- MISCELLANEOUS FUNCTIONS -- //

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

function wordwrap(text,limit) {
  var words = text.split(" ");
  var lines = [""];
  for (var i=0; i<words.length; i++) {
    var word = words[i]
    lastLine = lines[lines.length-1];
    if (lastLine.length +word.length > limit) {
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
