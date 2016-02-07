var inputBox = document.getElementById('pageName');

//Bind the event of pressing enter inside the text box
inputBox.onkeypress = function(e) {
  var event = e || window.event;
  var charCode = event.which || event.keyCode;
  if ( charCode == '13' ) { //Enter was pressed inside dialog
    var pagename = document.getElementById('pageName').value || "Wikipedia";
    startpage = getPageName(pagename);
    createNetwork(startpage);
  }
}


//Bind the action of pressing the button
var submitButton = document.getElementById('submit');

submitButton.onclick = function() {
  var pagename = document.getElementById('pageName').value || "Wikipedia";
  startpage = getPageName(pagename);
  createNetwork(startpage);
}
