// This script contains the code that binds actions to events, both within the
// network, in the search bar, and for the modal popup.


// Have changes been made
var changesmade = false;
var inputBox;

//Functions that will be used as bindings
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

function openPageEvent (params) {
  if (params.nodes.length) {
    var page = params.nodes[0];
    var url = "http://en.wikipedia.org/wiki/"+page;
    window.open(url, '_blank');
  }
}

// Bind the network events
function bindNetwork(){
  if (isTouchDevice) { // Device has touchscreen
    network.on("hold", expandEvent);
    //Highlight traceback on click
    network.on("click",mobileTraceEvent);
  } else { // Device does not have touchscreen
    network.on("click", expandEvent); // Expand on click
    network.on("hoverNode", function(params){traceBack(params.node)} ); // Highlight on hover
    network.on("blurNode", resetProperties); // Reset on un-hover
  }

  //Bind double-click to open page
  network.on("doubleClick", openPageEvent);
}

window.onload = function() {

  // Prevent iOS scrolling
  document.ontouchmove = function(event){
    event.preventDefault();
  }

  // Bind actions for search component.

  var cf = document.getElementsByClassName("commafield")[0];
  //Bind the action of pressing the button
  var submitButton = document.getElementById('submit');
  submitButton.onclick = function() {
    resetNetworkFromInput()
  }

  var randomButton = document.getElementById('random');
  randomButton.onclick = function() {
    getRandomName(function (data) {
      resetNetwork(data);
      clearItems(cf);
      addItem(cf, decodeURIComponent(data));
    });
  }


  //Bind modal events.
  var aboutButton = document.getElementById('about');
  var modal = document.getElementById("modal");

  aboutButton.onclick = function() {
    modal.style.display = "block";
  }

  modal.onclick = function(event) {
    if (event.target.id == "modal") { //Clicking on modal-content won't hide it
      modal.style.display = "none";
    }
  }

  //Allow iOS scrolling for the modal
  var modalcontent = document.getElementById("modal-content");
  modalcontent.ontouchmove = function(event) {
    event.stopPropagation();
  }
}
