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
  this.elem = document.createElement("div");
  this.elem.className = mainclass + " progressbar";
  this.bar = document.createElement("div");
  this.bar.className = barclass + " progressbar-indicator";
  this.elem.appendChild(this.bar);
  // Start at 0%
  this.bar.style.width = "0px";
  // Function to set progress
  this.progress = function(amount) {
    if (amount === undefined) {
      this.bar.style.width = this.elem.offsetWidth * amount + "px";
    } else {
      return this.bar.offsetWidth / this.elem.offsetWidth;
    }
  };
}
