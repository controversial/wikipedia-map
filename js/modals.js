// Tiny library for presenting modal dialogs. Example usage:
/*
 * <div id="popup">
 *   Hello!
 * </div>

 * <script>
 *   Modal("<div>Hello!</div>").present()
 * </script>
 */

function Modal(element, clickToDismiss) {
  // Allow clicking to dismiss by default
  this.clickToDismiss = (clickToDismiss === undefined ? true : clickToDismiss);

  // Construct a centered floating box
  this.elem = document.createElement('div');
  if (typeof element === 'string') {
    this.elem.innerHTML = element;
  } else {
    this.elem.appendChild(element);
  }
  this.elem.className = 'centered';

  this.backdrop = document.createElement('div');
  this.backdrop.className = 'modal-background transparent-blur';

  this.backdrop.appendChild(this.elem);

  // Allow dismissing the modal with a click on the background
  this.backdrop.parent = this;
  this.backdrop.addEventListener('click', (event) => {
    // Clicking on modal content won't hide it, only clicking the background will.
    if ((event.target.className.indexOf('modal-background') !== -1) && this.parent.clickToDismiss) {
      this.parent.close();
    }
  });

  // Expose API

  this.present = () => { document.body.appendChild(this.backdrop); };
  this.close = () => { document.body.removeChild(this.backdrop); };
}
