// This script contains the code necessary to load the modal with the README


//Render `data` and load it into the modal
function loadHTML(data) {
  var readmeHTML = marked(data); //Render README from markdown to HTML
  var modalContent = document.getElementById("modal-content");
  modalContent.innerHTML = readmeHTML;
}

//requestPage("README.md",loadHTML); //Read README.md

//Menu items
var menuMain = document.getElementById("menu-main");
var menuControls = document.getElementById("menu-controls");
var menuReadme = document.getElementById("menu-readme");

var selectedPage=menuMain;

function removeAnimClasses(elem) { //Remove all animation classes from elem
  var cn = elem.className;
  var ac = [" toLeft"," toRight"," fromLeft"," fromRight"]; //Animation classes
  for (var i=0;i<ac.length;i++) {
    while (cn.indexOf(ac[i])>=0) {
      cn = cn.replace(ac[i],"");
    }
  }
  elem.className=cn;
}

function animatePage(newPage) { //Move to `page`
  selectedPage.className += " toLeft";
  newPage.className += " fromRight";
  newPage.style.display = "block";

  setTimeout(function() {
    //Reset the scene
    removeAnimClasses(selectedPage);
    removeAnimClasses(newPage);
    selectedPage.style.display = "none";
    newPage.style.display = "block"; //In case of rapid button-pressing
    selectedPage = newPage;
  },600);

}

function animateReturn() { //Return to menu
  selectedPage.className += " toRight";
  menuMain.className += " fromLeft";
  menuMain.style.display = "block";

  setTimeout(function() {
    //Reset the scene
    removeAnimClasses(selectedPage);
    removeAnimClasses(menuMain);
    selectedPage.style.display = "none";
    menuMain.style.display = "block"; //In case of rapid button-pressing
    selectedPage = menuMain;
  },600);
}

var button=document.getElementById("movetest");
button.onclick=function(){
  animatePage(menuControls);
}
var button2=document.getElementById("goHome");
button2.onclick=function(){
  animateReturn()
}
