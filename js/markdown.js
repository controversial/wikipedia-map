// This script contains the code necessary to load the modal with the README


//Read README.md, render it to HTML, and set the modal content to that.
var readme = requestPage("README.md"); //Read README.md
var readmeHTML = marked(readme); //Render README from markdown to HTML
var modalContent = document.getElementById("modal-content");
modalContent.innerHTML = readmeHTML;
