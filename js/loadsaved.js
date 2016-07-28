// Load a saved graph if an ID is provided in the query string

function loadSaved() {
  if (window.location.search) {
    progressbar = new Progress("Restoring saved graph...");
    modalWindow = new Modal(progressbar.container, false);
    modalWindow.present();
    // Make the blank network
    makeNetwork();
    progressbar.progress(0.02);
    // Set up event listeners for the loading (starting at 2%)
    network.on("stabilizationProgress", function(params) {
      progressbar.progress(params.iterations / params.total + 0.02);
    });
    network.once("stabilizationIterationsDone", function() {
      modalWindow.close();
    });
    loadGraph(window.location.search.substring(1));
  }
}
