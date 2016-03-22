/* This contains the JavaScript code for the 'commafield,' which is basically
a tag input. It just gives visual feedback that inputs were 'registered' when a
user is inputting multiple elements.
*/

// == HELPER FUNCTIONS == //

// An onclick function that removes the element clicked
function removeThis() {
  this.parentElement.removeChild(this);
}

// Add an item to an input
function addItem(cf, itemtext) {
  var item = document.createElement("div");
  var text = document.createTextNode(itemtext);
  item.appendChild(text);
  item.className = "item";
  item.onclick = removeThis;
  cf.insertBefore(item, cf.getElementsByTagName("input")[0]);
}

// Remove the last item from a commafield
function removeLast(cf) {
  var items = cf.getElementsByClassName("item");
  if (items.length) {
    var item = items[items.length-1];
    cf.removeChild(item);
  }
}

// == CONVERT ALL ELEMENTS WITH APPROPRIATE CLASS //

var cfs = document.getElementsByClassName("commafield");

for (var i=0; i<cfs.length; i++) {
  var cf = cfs[i]
  // Create the input box
  cf.innerHTML = '<input class="cfinput" type="text"/>';

  // Bind key events
  cf.onkeydown = function (e) {
    e = e || window.event;
    var charcode = e.which || e.keyCode;
    var inp = this.getElementsByTagName("input")[0]
    // Check key codes
    var keycode = e.which || e.keyCode
    switch (keycode) {
      // Comma was pressed. Insert comma if 'Alt' was held, otherwise continue
      case 188:
        if (e.altKey) {
          e.preventDefault(); // Don't insert a '≤'
          inp.value += ",";
          break;
        }
      // Comma (sans-Alt), Enter, or Tab was pressed.
      case 13:
      case 9:
        e.preventDefault(); // Stop normal action
        // Add item and clear input if anything besides whitespace was entered
        if (inp.value.trim().length) {
          addItem(this, inp.value.trim());
          inp.value = "";
        }
        break;
      // Delete was pressed.
      case 8:
        // If we're at the beginning of text insertion, delete last item
        if (inp.value == "") {
          removeLast(this)
        }
        break;
    }
  }
}


// == PUBLIC API == //

// Return a list of the text in each item of an element or string representing its id
function getItems(cf) {
  // Get the element if a string id was provided
  if (typeof cf == "string") {cf = document.getElementById(cf)}
  var items = cf.getElementsByClassName("item");
  var items = Array.prototype.slice.call(items) // Convert to array
  return items.map( function(i){return i.textContent} );
}
