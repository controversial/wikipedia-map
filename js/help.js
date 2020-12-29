/* global Shepherd */
const isTouchDevice = 'd' in document.documentElement;

// Create the Shepherd tour

const buttons = document.getElementById('buttons');
const formbox = document.getElementById('formbox');

const shepherd = new Shepherd.Tour({
  defaults: {
    classes: 'shepherd-theme-arrows',
    showCancelLink: true,
  },
});

// Add steps to the Shepherd tour.

shepherd.addStep({
  text: [
    'Input the name of a Wikipedia article here.',
    'You can compare multiple topics by pressing <kbd>,</kbd> ' +
    '<kbd>Tab</kbd> or <kbd>Enter</kbd> after each one.',
  ],
  attachTo: '#input bottom',
  buttons: [
    {
      text: 'Back',
      classes: 'shepherd-button-secondary',
      action: shepherd.back,
    },
    {
      text: 'Next',
      classes: 'shepbtn',
      action: shepherd.next,
    },
  ],
});

shepherd.addStep({
  text: [
    "Once you're done, submit your query.",
    'Wikipedia Map will create a node for each input topic.',
  ],
  attachTo: '#submit bottom',
  buttons: [
    {
      text: 'Back',
      classes: 'shepherd-button-secondary',
      action: shepherd.back,
    },
    {
      text: 'Next',
      classes: 'shepbtn',
      action: shepherd.next,
    },
  ],
  tetherOptions: {
    attachment: 'top left',
    targetAttachment: 'bottom center',
    offset: '0px -35px',
  },
});

shepherd.addStep({
  text: [
    'Click a node to expand it.',
    'Expanding a node creates a new node for each Wikipedia article linked in the first paragraph of the article whose node you clicked.',
    '<img src="https://images.prismic.io/luke/db049805-b070-43c5-a412-d44c5ac3a4d7_wikipedia-expand.gif" alt="Expanding a Wikipedia Map node" style="width: 410px; height: 410px;" />',
  ],
  buttons: [
    {
      text: 'Back',
      classes: 'shepherd-button-secondary',
      action: shepherd.back,
    },
    {
      text: 'Next',
      classes: 'shepbtn',
      action: shepherd.next,
    },
  ],
});

shepherd.addStep({
  text: [
    'Keep expanding nodes to build a map and connect topics!',
  ],
  buttons: [
    {
      text: 'Back',
      classes: 'shepherd-button-secondary',
      action: shepherd.back,
    },
    {
      text: "Let's go!",
      classes: 'shepbtn',
      action: shepherd.next,
    },
  ],
});

// Take away the info box when the tour has started...
shepherd.on('start', () => {
  document.getElementById('container').style.opacity = 0.3;
  document.getElementById('container').style.pointerEvents = 'none';
  formbox.style.opacity = 0.3;
  buttons.style.opacity = 0.3;
});

// ... and bring it back when the tour goes away
function opaque() {
  document.getElementById('container').style.opacity = '';
  document.getElementById('container').style.pointerEvents = '';
  formbox.style.opacity = 1;
  buttons.style.opacity = 1;
}
shepherd.on('complete', () => {
  opaque();
  document.querySelector('#input input').focus();
});
shepherd.on('cancel', opaque);

// Prompt user for input when none detected
function noInputDetected() {
  document.getElementById('container').style.opacity = 0.3;
  buttons.style.opacity = 0.3;
  shepherd.show();
}
