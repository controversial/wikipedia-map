// Load a saved graph if an ID is provided in the query string

function loadSaved() {
  if (window.location.search) {
    makeNetwork();
    loadGraph(window.location.search.substring(1));
  }
}
