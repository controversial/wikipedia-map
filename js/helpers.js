//Get the color for a node, lighten an orange based on level. Subtle.
function getColor(level) {
  var color = tinycolor("fcb587");
  return color.lighten(2*level).toString();
};

function getBlueColor(level) {
  var color = tinycolor("87b5fc"); //Note this is orange with RGB reversed.
  return color.lighten(2*level).toString();
};

function getTraceBackNodes(node) {
  var finished = false;
  var startnode = nodes.get(startpage);
  var path = [];
  while (! finished) { //Add parents of nodes until we reach the start
    path.push(node);
    if (node==startpage) { //Check if we've reached the end
      finished = true;
    };
    node = nodes.get(node).parent; //Keep exploring with the node above.
  };
  return path;

}
