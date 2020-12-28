/* global nodes, network, isTouchDevice, shepherd */
/* global expandNode, traceBack, resetProperties, resetNetworkFromInput, randomReset, unwrap */
// This script contains (most of) the code that binds actions to events.


// Functions that will be used as bindings
function expandEvent(params) { // Expand a node (with event handler)
  if (params.nodes.length) { // Did the click occur on a node?
    const page = params.nodes[0]; // The id of the node clicked
    expandNode(page);
  }
}

function mobileTraceEvent(params) { // Trace back a node (with event handler)
  if (params.nodes.length) { // Was the click on a node?
    // The node clicked
    const page = params.nodes[0];
    // Highlight in blue all nodes tracing back to central node
    traceBack(page);
  } else {
    resetProperties();
  }
}

function openPageEvent(params) {
  if (params.nodes.length) {
    const nodeid = params.nodes[0];
    const page = encodeURIComponent(unwrap(nodes.get(nodeid).label));
    const url = `http://en.wikipedia.org/wiki/${page}`;
    window.open(url, '_blank');
  }
}

// Bind the network events
function bindNetwork() {
  if (isTouchDevice) { // Device has touchscreen
    network.on('hold', expandEvent); // Long press to expand
    network.on('click', mobileTraceEvent); // Highlight traceback on click
  } else { // Device does not have touchscreen
    network.on('click', expandEvent); // Expand on click
    network.on('hoverNode', params => traceBack(params.node)); // Highlight traceback on hover
    network.on('blurNode', resetProperties); // un-traceback on un-hover
  }

  // Bind double-click to open page
  network.on('doubleClick', openPageEvent);
}

function bind() {
  // Prevent iOS scrolling
  document.addEventListener('touchmove', e => e.preventDefault());

  // Bind actions for search component.

  const cf = document.querySelector('.commafield');
  // Bind go button press
  const submitButton = document.getElementById('submit');
  submitButton.addEventListener('click', () => {
    shepherd.cancel(); // Dismiss the tour if it is in progress
    resetNetworkFromInput();
  });

  const randomButton = document.getElementById('random');
  randomButton.addEventListener('click', randomReset);

  // Bind tour start
  const tourbtn = document.getElementById('tourinit');
  const helpButton = document.getElementById('help');
  tourbtn.addEventListener('click', () => shepherd.start());
  helpButton.addEventListener('click', () => shepherd.start());

  // Bind GitHub button
  const ghbutton = document.getElementById('github');
  ghbutton.addEventListener('click', () => window.open('https://github.com/controversial/wikipedia-map', '_blank'));

  // Bind About button
  const aboutButton = document.getElementById('about');
  aboutButton.addEventListener('click', () => window.open('https://github.com/controversial/wikipedia-map/blob/master/README.md#usage', '_blank'));
}
