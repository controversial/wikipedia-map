// This script contains the code necessary to load the modal with the README


//Render `data` and load it into the modal
function loadHTML(data) {
  var readmeHTML = marked(data); //Render README from markdown to HTML
  var modalContent = document.getElementById("modal-content");
  modalContent.innerHTML = readmeHTML;
}

requestPage("README.md",loadHTML); //Read README.md
