var inputBox = document.getElementById('pageName');

//Reset the network with the page searched when enter pressed inside the input
inputBox.onkeypress = function(e) {

  var event = e || window.event;
  var charCode = event.which || event.keyCode;

  if ( charCode == '13' ) { //Enter was pressed inside dialog

    startpage = getPageName(document.getElementById('pageName').value);
    createNetwork(startpage);

  }
}
