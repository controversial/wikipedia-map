//Get the color for a node, lighten an orange based on level. Subtle.
function getColor(level) {
  var color = tinycolor("fcb587");
  return color.lighten(2*level).toString();
}
