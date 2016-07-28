var isTouchDevice = 'd' in document.documentElement;

// Create the Shepherd tour

var container = document.getElementById("container");
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
  ],
  tetherOptions :{
      'attachment':'bottom right',
      'targetAttachment':'left center',
      'offset':'-55px 20px'
  },
});

shepherd.addStep({
  text: ["Input the name of a Wikipedia article here.",
         "You can compare multiple topics by pressing <code>,</code> " +
         "<code>Tab</code> or <code>Enter</code> after each one."],
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
  container.style.opacity = 0.3;
  formbox.style.opacity = 0.3;
  buttons.style.opacity = 0.3;
});

// ... and bring it back when the tour goes away
function opaque () {
  container.style.opacity = 1;
  formbox.style.opacity = 1;
  buttons.style.opacity = 1;
}
shepherd.on("complete", opaque);
shepherd.on("cancel", opaque);

// Prompt user for input when none detected
function noInputDetected() {
  container.style.opacity = 0.3;
  buttons.style.opacity = 0.3;
  shepherd.show(2);
}
