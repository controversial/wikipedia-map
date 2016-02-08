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