/* This contains the JavaScript code for the 'commafield,' which is basically
a tag input. It just gives visual feedback that inputs were 'registered' when a
user is inputting multiple elements. Running this script will transform all
elements with the 'commafield' class name to comma separated input field.
*/

// == HELPER FUNCTIONS == //

// Turn placeholder on for a commafield
function onPlaceholder(cf) {
  if (cf.hasAttribute('data-placeholder')) {
    const inp = cf.getElementsByTagName('input')[0];
    inp.setAttribute('placeholder', cf.getAttribute('data-placeholder'));
  }
}

// Turn placeholder off for a commafield
function offPlaceholder(cf) {
  if (cf.hasAttribute('data-placeholder')) {
    const inp = cf.getElementsByTagName('input')[0];
    inp.removeAttribute('placeholder');
  }
}

// An onclick function that removes the element clicked
function removeThis() {
  const parent = this.parentElement;
  parent.removeChild(this);
  // If this was the last element, turn on the placeholder
  if (parent.getElementsByClassName('item').length === 0) {
    onPlaceholder(parent);
  }
}

// == PUBLIC API == //

// Return a list of the text in each item of an element (specified by either the node or an id)

function getRegisteredItems(inp) {
  // Get the element if a string id was provided
  const cf = typeof inp === 'string' ? document.getElementById(inp) : inp;
  const items = Array.from(cf.getElementsByClassName('item'));
  return items.map(i => i.textContent);
}

function getItems(inp) {
  const itemtexts = getRegisteredItems(inp);
  // Add the input box's text if anything is entered
  const cf = typeof inp === 'string' ? document.getElementById(inp) : inp;
  if (cf.getElementsByTagName('input')[0].value.trim().length) {
    itemtexts.push(cf.getElementsByTagName('input')[0].value);
  }
  return itemtexts;
}


// Back to inner workings

// Add an item to an input
function addItem(cf, itemtext) {
  const item = document.createElement('div');
  const text = document.createTextNode(itemtext);
  item.appendChild(text);
  item.className = 'item';
  item.onclick = removeThis;
  cf.insertBefore(item, cf.getElementsByTagName('input')[0]);
  // Turn off the placeholder
  offPlaceholder(cf);
}

// Remove the last item from a commafield
function removeLast(cf) {
  const items = cf.getElementsByClassName('item');
  if (items.length) cf.removeChild(items[items.length - 1]);
  // Turn the placeholder back on only if no tags are entered
  if (!getRegisteredItems(cf).length) onPlaceholder(cf);
}

// Clear all items from a commafield
function clearItems(cf) {
  // Clear input
  cf.getElementsByTagName('input')[0].value = '';
  while (cf.getElementsByClassName('item').length) {
    removeLast(cf);
  }
}

// == Keybindings function == //
function cfKeyDown(e = window.event) {
  // Check key codes
  const keycode = e.which || e.keyCode;
  const inp = e.target;

  switch (keycode) {
    // Comma was pressed. Insert comma if 'Alt' was held, otherwise continue
    case 188:
      if (e.altKey) {
        e.preventDefault(); // Don't insert a '≤'
        inp.value += ',';
        break;
      }
    // Comma (sans-Alt), Enter, or Tab was pressed.
    case 13:
    case 9:
      e.preventDefault(); // Stop normal action
      // Add item and clear input if anything besides whitespace was entered
      if (inp.value.trim().length &&
          // Prevent duplicates
          getRegisteredItems(this).indexOf(inp.value) === -1) {
        addItem(this, inp.value.trim());
        inp.value = '';
      }
      break;
    // Delete was pressed.
    case 8:
      // If we're at the beginning of text insertion, delete last item
      if (inp.value === '') {
        removeLast(this);
      }
      break;
    default:
      break;
  }
}

// == CONVERT ALL ELEMENTS WITH APPROPRIATE CLASS == //

const cfs = Array.from(document.getElementsByClassName('commafield'));

cfs.forEach((cf) => {
  // Create the input box
  const input = '<input class="cfinput" type="text"/>';
  cf.innerHTML = input;

  // If the element specified a placeholder, display that in the input.
  // Placeholder will show only if the input is blank and there are no tags
  // entered. This is designed to mimic the way a normal input works.
  onPlaceholder(cf); // Turn placeholder on (if applicable)

  // Bind key events
  cf.onkeydown = cfKeyDown;
});

