// Create the Shepherd tour

var infobox = document.getElementById("info");
var buttons = document.getElementById("buttons");
var formbox = document.getElementById("formbox");

var shepherd = new Shepherd.Tour({
  defaults: {
    classes: "shepherd-theme-arrows",
    showCancelLink: true
  }
});

// Add steps to the Shepherd tour.

shepherd.addStep({
  text: "Wikipedia Map is an interactive web app for visualizing the " +
        "connections between Wikipedia pages.",
  buttons: [
    {
      text: "Skip",
      classes: "shepherd-button-secondary",
      action: shepherd.cancel
    },
    {
      text: "Next",
      classes: "shepbtn",
      action: function(){
        shepherd.next();
        buttons.style.opacity = 1;
      }
    }
  ]
});

shepherd.addStep({
  text: "Wikipedia Map is 100% open source, as are each of the libraries on "+
        "which it depends. You can visit Wikipedia Map on GitHub.",
  attachTo: "#github left",
  buttons: [
    {
      text: "Back",
      classes: "shepherd-button-secondary",
      action: shepherd.back
    },
    { // Add a button to visit on GitHub
      text: "Visit",
      classes: "shepherd-button-secondary",
      action: function() {
        window.open("https://github.com/The-Penultimate-Defenestrator/wikipedia-map");
      }
    },
    {
      text: "Next",
      classes: "shepbtn",
      action: function(){
        shepherd.next();
        buttons.style.opacity = 0.3;
        formbox.style.opacity = 1;
      }
    }
  ]
});

shepherd.addStep({
  text: ["Input the name of a Wikipedia article here.",
         " You can start with " + "and compare multiple articles by pressing "+
         "<code>,</code> <code>Tab</code> or <code>Enter</code> after each one."],
  attachTo: "#input bottom",
  buttons: [
    {
      text: "Back",
      classes: "shepherd-button-secondary",
      action: shepherd.back
    },
    {
      text: "Next",
      classes: "shepbtn",
      action: shepherd.next
    }
  ]
});

shepherd.addStep({
  text: ["Once you're done, submit your query.",
         "Wikipedia Map will create a node for each input."],
  attachTo: "#submit bottom",
  buttons: [
    {
      text: "Back",
      classes: "shepherd-button-secondary",
      action: shepherd.back
    },
    {
      text: "Let's go!",
      classes: "shepbtn",
      action: expandNodeNext
    }
  ],
  tetherOptions :{
      'attachment':'top left',
      'targetAttachment':'bottom center',
       'offset':'0px -35px'
  },
});

shepherd.addStep({
  text: ["Here's an example node. Click on it to expand it!"],
  attachTo: "#tourexpandnode bottom", //change to the new invisible div
  buttons: [
    {
      text: "Back",
      classes: "shepherd-button-secondary",
      action: shepherd.next
    },
    {
      text: "Got it!",
      classes: "shepbtn",
      action: shepherd.next
    }
  ],
  tetherOptions :{
      'attachment':'top left',
      'targetAttachment':'bottom center',
       'offset':'0px -35px'
  },
});

// Take away the info box when the tour has started...
shepherd.on("start", function () {
  infobox.style.opacity = 0.3;
  formbox.style.opacity = 0.3;
  buttons.style.opacity = 0.3;
});

// ... and bring it back when the tour goes away
function opaque () {
  infobox.style.opacity = 1;
  formbox.style.opacity = 1;
  buttons.style.opacity = 1;
}
shepherd.on("complete", opaque);
shepherd.on("cancel", opaque);

// Custom action handler to show how to expand node
function expandNodeNext() {
  var cf = document.getElementsByClassName("commafield")[0] 
  addItem(cf, "Cat"); //add example item
  resetNetworkFromInput(); 
  //get position of starting node
  var startNode = cf.getElementsByClassName("item")[0];
  var position = startNode.getBoundingClientRect();  
  var startDiv = document.getElementById("tourexpandnode");
  startDiv.style.position = "absolute";
  startDiv.style.top = position.top;
  startDiv.style.left = position.left;

  // var position = network.getPosition(startNode.id);
  // var startDiv = document.getElementById("tourexpandnode");
  // startDiv.style.position = "absolute";
  // startDiv.style.top = position.top;
  // startDiv.style.left = position.left;
  shepherd.next();
}

// Prompt user for input when none detected
function noInputDetected() {
  shepherd.start();
  shepherd.next();
  shepherd.next(); //skip to the step explaining how input works
  formbox.style.opacity = 1;
}

// Load the modal with the README and other info

//Render `data` and load it into the modal
function loadHTML(data) {
  var readmeHTML = marked(data); //Render README from markdown to HTML
  var target = document.getElementById("readme");
  target.innerHTML = readmeHTML;
}

requestPage("README.md",loadHTML); //Read README.md and load it into the appropriate menu

//Menu items
var menuMain = document.getElementById("menu-main");
// The currently selected page
var selectedPage=menuMain;


//== EASY ANIMATION FUNCTIONS ==//
//Remove all animation classes from elem
function removeAnimClasses(elem) {
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


// Bind opening the help pages
document.getElementById("aboutActivator").onclick=function(){ //Open about page
  animatePage(document.getElementById("menu-about"));
};
document.getElementById("controlsActivator").onclick=function(){ // Open controls page
  animatePage(document.getElementById("menu-controls"));
};
document.getElementById("readmeActivator").onclick=function(){ //Open README page
  animatePage(document.getElementById("menu-readme"));
};
// Bind all the back buttons to return to main menu page
backButtons=document.getElementsByClassName("backbutton");
for (var i=0;i<backButtons.length;i++) {
  backButtons[i].onclick=animateReturn;
}

// Is the user on a touch device?
var isTouchDevice = 'd' in document.documentElement;

var controlspage = document.getElementById("controls");

// Controls message for desktop devices
var desktopControls =
"<h1> Controls </h1>"+
"<p> You're on a desktop device, so the desktop controls are active. This page " +
"describes the desktop controls, which may be different on mobile touch devices.</p>" +

"<h3> Navigation </h3>" +
"<p> Click and drag to pan, and scroll to zoom. </p>" +

"<h3> Expanding nodes </h3>" +
"<p>To expand a node, just click on the node. The node might take a while to " +
"expand, depending on the speed of my server, Wikipedia's servers, and your " +
"internet connection. </p> " +

"<h3> Tracebacks </h3>" +
"<p> You can see the path you took to get to a node by mousing-over the node.</p>" +

"<h3> Opening pages </h3>" +
"<p> You can open the Wikipedia page for a node at any time, simply by " +
"double-clicking it. Double-clicking the node <em>Cat</em> will open the wikipedia " +
"page for <em>Cat</em>. In most browsers, the page will open in a new tab. Pop-up " +
"blockers might stop this. </p>";

// Controls message for touch devices
var touchControls =
"<h1> Controls </h1>" +
"<p> You're on a touch device, so the touch controls are active. This page " +
"describes the touch controls, controls may be different on desktop devices " +
"without touchscreens. </p>" +

"<h3> Navigation </h3>" +
"<p> You can use the classic and natural touch controls of pinch to zoom and " +
"drag to pan. </p>"+

"<h3> Expanding nodes </h3>" +
"<p>To expand a node, long-press on the node. You won't have to press for more than " +
"half a second, but the node might take slightly longer than that to expand.</p>" +

"<h3> Tracebacks </h3>" +
"<p> You can see the path you took to get to a node by lightly tapping the node. " +
"Tap anywhere else to stop highlighting the traceback. </p>" +

"<h3> Opening pages </h3>" +
"<p> You can open the Wikipedia page for a node at any time, simply by " +
"double-tapping on it. Double-tapping the node <em>Cat</em> will open the wikipedia " +
"page for <em>Cat</em>. The page will open in a new tab.</p>";


// Load controls message based on device
if (isTouchDevice) {
  controlspage.innerHTML=touchControls;
} else {
  controlspage.innerHTML=desktopControls;
}
