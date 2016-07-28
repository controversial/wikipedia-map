// Tiny library for progress bars. Example usage:
/*
<div id="progressbar">
  <div></div>
</div>

<script>
  var p_elem = document.getElementById("#progressbar")
  var p = new Progress(p_elem)
  p.progress(0.5)
</script>
*/

function Progress(mainclass, barclass) {
  mainclass = mainclass || "";
  barclass = barclass || "";
  this.container = document.createElement("div");
  // Create the progress bar
  this.elem = document.createElement("div");
  this.elem.className = mainclass + " progressbar";
  this.bar = document.createElement("div");
  this.bar.className = barclass + " progressbar-indicator";
  // Create the label
  this.label = document.createElement("div");
  this.label.className = "progressbar-label";
  this.label.textContent = "0";

  this.elem.appendChild(this.bar);
  this.container.appendChild(this.elem);
  this.container.appendChild(this.label);

  // Start at 0%
  this.bar.style.width = "0px";
  // Function to set progress
  this.progress = function(amount) {
    if (amount !== undefined) {
      this.bar.style.width = amount * 100 + "%";
      this.label.textContent = Math.floor(amount * 100);
    } else {
      return this.bar.offsetWidth / this.elem.offsetWidth;
    }
  };
}
