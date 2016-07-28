// Tiny library for presenting modal dialogs. Example usage:
/*
<div id="popup">
  Hello!
</div>

<script>
  Modal("<div>Hello!</div>").present()
</script>
*/

function Modal(element, tapToDismiss) {
  tapToDismiss = tapToDismiss || true;  // Allow tapping to dismiss by default

  // Construct a centered floating box
  this.elem = document.createElement("div");
  if (typeof element == "string") {
    this.elem.innerHTML = element;
  } else {
    this.elem.appendChild(element);
  }
  this.elem.className = "centered";

  this.backdrop = document.createElement("div");
  this.backdrop.className = "modal-background";

  this.backdrop.appendChild(this.elem);

  // Allow dismissing the modal with a click on the background
  this.backdrop.parent = this;
  this.backdrop.onclick = function(event) {
    if (event.target.className.indexOf("modal-background") !== -1) { // Clicking on modal content won't hide it, only clicking the background will.
      this.parent.close();
    }
  };

  // Expose API

  this.present = function() {
    document.body.appendChild(this.backdrop);
  };

  this.close = function () {
    document.body.removeChild(this.backdrop);
  };
}
