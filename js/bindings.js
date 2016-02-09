// This script contains the code that binds actions to events, both within the
// network, in the search bar, and for the modal popup.


// Is the user on a touch device?

var isTouchDevice = 'ontouchstart' in document.documentElement;

function expandEvent (params) { // Expand a node (with event handler)
  if (params.nodes.length) { //Did the click occur on a node?
    var page = params.nodes[0]; //The node clicked
    expandNode(page);
  }
}

function mobileTraceEvent (params) { // Trace back a node (with event handler)
  if (params.nodes.length) { //Was the click on a node?
    //The node clicked
    var page = params.nodes[0];
    //Highlight in blue all nodes tracing back to central node
    traceBack(page);
  } else {
    resetProperties();
  }
}


if (isTouchDevice) { // Device has touchscreen
  network.on("hold", expandEvent);
  //Highlight traceback on click
  network.on("click",mobileTraceEvent);
} else { // Device does not have touchscreen
  network.on("click", expandEvent);
  network.on("hoverNode", function(params) {
    console.log("hover");
    var page = params.node;
    traceBack(page);
  });
  network.on("blurNode", resetProperties);
}



// Bind actions for search component.
var inputBox = document.getElementById('pageName');

//Bind the event of pressing enter inside the text box
inputBox.onkeypress = function(e) {
  var event = e || window.event;
  var charCode = event.which || event.keyCode;
  if ( charCode == '13' ) { //Enter was pressed inside dialog
    var pagename = document.getElementById('pageName').value || "Wikipedia";
    startpage = getPageName(pagename);
    resetNetwork(startpage);
  }
}

//Bind the action of pressing the button
var submitButton = document.getElementById('submit');

submitButton.onclick = function() {
  var pagename = document.getElementById('pageName').value || "Wikipedia";
  startpage = getPageName(pagename);
  resetNetwork(startpage);
}




//Bind modal events.
var aboutButton = document.getElementById('about');
var modal = document.getElementById("modal");

aboutButton.onclick = function() {
  modal.style.display = "block";
}

window.onclick = function(event) {
  if (event.target.className == "modal") { //Clicked outside modal
    modal.style.display = "none";
  }
}
