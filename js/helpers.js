/* global vis, network, nodes, edges */
// This script contains helper functions that are used by other scripts to
// perform simple common actions.


// -- MISCELLANEOUS FUNCTIONS -- //

// Get the level of the highest level node that exists in the graph
function maxLevel() {
  const ids = nodes.getIds();
  const levels = ids.map(x => nodes.get(x).level);
  return Math.max.apply(null, levels);
}

// Convert a hex value to RGB
function hexToRGB(hex) {
  // eslint-disable-next-line no-param-reassign
  if (hex.startsWith('#')) hex = hex.slice(1, hex.length); // Remove leading #
  const strips = [hex.slice(0, 2), hex.slice(2, 4), hex.slice(4, 6)]; // Cut up into 2-digit strips
  return strips.map(x => parseInt(x, 16)); // To RGB
}
function rgbToHex(rgb) {
  const hexvals = rgb
    .map(x => Math.round(x).toString(16))
    .map(x => (x.length === 1 ? `0${x}` : x));
  // Add leading 0s to make a valid 6 digit hex
  return `#${hexvals.join('')}`;
}

// Lighten a given hex color by %
function lightenHex(hex, percent) {
  const rgb = hexToRGB(hex); // Convert to RGB
  const newRgb = rgb.map(x => x + ((Math.min(percent, 100) / 100) * (255 - x)));
  return rgbToHex(newRgb); // and back to hex
}
// Get the color for a node, lighten a blue based on level. Subtle.
function getColor(level) {
  return lightenHex('#03A9F4', 5 * level); // Gets 5% lighter for each level
}
// Get the highlighted color for a node, lighten a yellow based on level. Subtle.
function getYellowColor(level) {
  return lightenHex('#FFC107', 5 * level); // Gets 5% lighter for each level
}
// Get the color that an edge should be pointing to a certain level
function getEdgeColor(level) {
  const nodecolor = getColor(level);
  return vis.util.parseColor(nodecolor).border;
}


// Break a sentence into separate lines, trying to fit each line within `limit`
// characters. Only break at spaces, never break in the middle of words.
function wordwrap(text, limit) {
  const words = text.split(' ');
  const lines = [words[0]];
  words.slice(1).forEach((word) => {
    // Start a new line if adding this word to the previous line would overflow character limit
    if (lines[lines.length - 1].length + word.length > limit) lines.push(word);
    else lines[lines.length - 1] += ` ${word}`;
  });
  return lines.join('\n'); // Trim because the first line will start with a space
}
// Un-word wrap a sentence by replacing line breaks with spaces.
function unwrap(text) { return text.replace(/\n/g, ' '); }

// Get a "normalized" form of a page name to use as an ID. This is designed to
// minimize the number of duplicate nodes found in the network.
function getNormalizedId(id) {
  return id
    .toLowerCase() // Lowercase
    .replace(/\s/g, ' ') // Reduce spaces
    .replace(/[^A-Za-z\d%]/g, '') // Remove non-alphanumeric characters
    .replace(/s$/, ''); // Remove trailing s
}

// A cross-browser compatible alternative to Math.sign, because support is atrocious
function sign(x) {
  if (x === 0) return 0;
  return x > 0 ? 1 : -1;
}


// == NETWORK SHORTCUTS == //

// Color nodes from a list based on their level. If color=1, highlight color will be used.
function colorNodes(ns, color) {
  const colorFunc = color ? getYellowColor : getColor;

  for (let i = 0; i < ns.length; i += 1) {
    ns[i].color = colorFunc(ns[i].level);
    // Prevent snapping
    delete ns[i].x;
    delete ns[i].y;
  }
  nodes.update(ns);
  window.isReset = false;
}

// Set the width of some edges.
function edgesWidth(es, width) {
  for (let i = 0; i < es.length; i += 1) {
    es[i].width = width;
  }
  edges.update(es);
  window.isReset = false;
}

// Get the id of the edge connecting two nodes a and b
function getEdgeConnecting(a, b) {
  const edge = edges.get({
    filter: e => e.from === a && e.to === b,
  })[0];

  return (edge instanceof Object ? edge : {}).id;
}

// Get the network's center of gravity
function getCenter() {
  const nodePositions = network.getPositions();
  const keys = Object.keys(nodePositions);

  // Find the sum of all x and y values
  let xsum = 0; let ysum = 0;

  Object.values(nodePositions).forEach((pos) => {
    xsum += pos.x;
    ysum += pos.y;
  });

  return [xsum / keys.length, ysum / keys.length]; // Average is sum divided by length
}

// Get the position in which nodes should be spawned given the id of a parent node.
// This position is in place so that nodes begin outside the network instead of at the center,
// leading to less chaotic node openings in large networks.
function getSpawnPosition(parentID) {
  // Get position of the node with specified id.
  const { x, y } = network.getPositions(parentID)[parentID];
  const cog = getCenter();
  // Distances from center of gravity to parent node
  const dx = cog[0] - x; const dy = cog[1] - y;

  let relSpawnX; let relSpawnY;

  if (dx === 0) { // Node is directly above center of gravity or on it, so slope will fail.
    relSpawnX = 0;
    relSpawnY = -sign(dy) * 100;
  } else {
    // Compute slope
    const slope = dy / dx;
    // Compute the new node position.
    const dis = 200; // Distance from parent (keep equal to network.options.physics.springLength)
    relSpawnX = dis / Math.sqrt((slope ** 2) + 1);
    relSpawnY = relSpawnX * slope;
  }
  return [Math.round(relSpawnX + x), Math.round(relSpawnY + y)];
}
