/* global nodes, edges, getSpawnPosition, getNormalizedId, wordwrap, unwrap, getColor, getEdgeColor, getEdgeConnecting, getSubPages, colorNodes, edgesWidth */ // eslint-disable-line max-len
// This script contains the big functions that implement a lot of the core
// functionality, like expanding nodes, and getting the nodes for a traceback.


// -- GLOBAL VARIABLES -- //
window.isReset = true;
window.selectedNode = null;
window.traceedges = [];
window.tracenodes = [];
// ---------------------- //


// Rename a node, possibly merging it with another node if another node has that ID
function renameNode(oldId, newName) {
  const oldNode = nodes.get(oldId);
  const newId = getNormalizedId(newName);
  // The node doesn't need to be renamed
  if (newId === oldId) return oldId;
  // The node needs to be renamed - the new name doesn't exist on the graph yet.
  edges.update([
    // Update all edges that were 'from' oldId to be 'from' newId
    ...edges.get({
      filter: e => e.from === oldId,
    }).map(e => ({ ...e, from: newId })),
    // Update all edges that were 'to' oldId to be 'to' newId
    ...edges.get({
      filter: e => e.to === oldId,
    }).map(e => ({ ...e, to: newId })),
  ]);
  // The node already exists! We're just merging it
  if (nodes.get(newId)) {
    nodes.remove(oldId);
    nodes.update({ id: newId, label: newName });
    console.log(`Merging ${oldId} with ${newId}`);
    // We're actually replacing the node
  } else {
    console.log(`Re-identifying ${oldId} as ${newId}`);
    nodes.remove(oldId);
    nodes.add({ ...oldNode, id: newId, label: wordwrap(newName, oldNode.level === 0 ? 20 : 15) });
  }
  // Update any nodes whose parent was the old node
  nodes.update(
    nodes.get({
      filter: n => n.parent === oldId,
    }).map(n => ({ ...n, parent: newId })),
  );
  // If the old node was highlighted or used as part of a highlight, move the highlight
  if (window.selectedNode === oldId) window.selectedNode = newId;
  window.tracenodes = window.tracenodes.map(id => (id === oldId ? newId : id));
  // If the node was a start node, replace it
  window.startpages = window.startpages.map(id => (id === oldId ? newId : id));
  // Return the new ID
  return newId;
}

// Callback to add to a node once data is recieved
function expandNodeCallback(page, data) {
  const node = nodes.get(page); // The node that was clicked
  const level = node.level + 1; // Level for new nodes is one more than parent
  const subpages = data;

  // Add all children to network
  const subnodes = [];
  const newedges = [];
  // Where new nodes should be spawned
  const [x, y] = getSpawnPosition(page);
  // Create node objects
  for (let i = 0; i < subpages.length; i += 1) {
    const subpage = subpages[i];
    const subpageID = getNormalizedId(subpage);
    if (!nodes.getIds().includes(subpageID)) { // Don't add if node exists
      subnodes.push({
        id: subpageID,
        label: wordwrap(decodeURIComponent(subpage), 15),
        value: 1,
        level,
        color: getColor(level),
        parent: page,
        x,
        y,
      });
    }

    if (!getEdgeConnecting(page, subpageID)) { // Don't create duplicate edges in same direction
      newedges.push({
        from: page,
        to: subpageID,
        color: getEdgeColor(level),
        level,
        selectionWidth: 2,
        hoverWidth: 0,
      });
    }
  }

  // Add the new components to the datasets for the graph
  nodes.add(subnodes);
  edges.add(newedges);
}

// Expand a node without freezing other stuff
function expandNode(id) {
  const pagename = unwrap(nodes.get(id).label);
  getSubPages(pagename).then(({ redirectedTo, links }) => {
    const newId = renameNode(id, redirectedTo);
    expandNodeCallback(newId, links);
  });
  // Mark the expanded node as 'locked' if it's one of the commafield items
  const cf = document.getElementById('input');
  const cfItem = cf.querySelector(`.item[data-node-id="${id}"]`);
  if (cfItem) cfItem.classList.add('locked');
}

// Get all the nodes tracing back to the start node.
function getTraceBackNodes(node) {
  let currentNode = node;
  let finished = false;
  let iterations = 0;
  const path = [];
  while (!finished) { // Add parents of nodes until we reach the start
    path.push(currentNode);
    if (window.startpages.indexOf(currentNode) !== -1) { // Check if we've reached the end
      finished = true;
    }
    currentNode = nodes.get(currentNode).parent; // Keep exploring with the node above.
    // Failsafe: avoid infinite loops in case something got messed up with parents in the graph
    if (iterations > 100) return [];
    iterations += 1;
  }
  return path;
}

// Get all the edges tracing back to the start node.
function getTraceBackEdges(tbnodes) {
  tbnodes.reverse();
  const path = [];
  for (let i = 0; i < tbnodes.length - 1; i += 1) { // Don't iterate through the last node
    path.push(getEdgeConnecting(tbnodes[i], tbnodes[i + 1]));
  }
  return path;
}

// Reset the color of all nodes, and width of all edges.
function resetProperties() {
  if (!window.isReset) {
    window.selectedNode = null;
    // Reset node color
    const modnodes = window.tracenodes.map(i => nodes.get(i));
    colorNodes(modnodes, 0);
    // Reset edge width and color
    const modedges = window.traceedges.map((i) => {
      const e = edges.get(i);
      e.color = getEdgeColor(nodes.get(e.to).level);
      return e;
    });
    edgesWidth(modedges, 1);
    window.tracenodes = [];
    window.traceedges = [];
  }
}

// Highlight the path from a given node back to the central node.
function traceBack(node) {
  if (node !== window.selectedNode) {
    resetProperties();
    window.selectedNode = node;
    window.tracenodes = getTraceBackNodes(node);
    window.traceedges = getTraceBackEdges(window.tracenodes);
    // Color nodes yellow
    const modnodes = window.tracenodes.map(i => nodes.get(i));
    colorNodes(modnodes, 1);
    // Widen edges
    const modedges = window.traceedges.map((i) => {
      const e = edges.get(i);
      e.color = { inherit: 'to' };
      return e;
    });
    edgesWidth(modedges, 5);
  }
}
