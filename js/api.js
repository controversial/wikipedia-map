// This script contains the code necessary to make requests to the python API,
// as well as a more general function which is also used to fetch the README
// for rendering.


//Make a synchronous request and return the response
function requestPage(url) {
  var data = null;
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      data = xhttp.responseText;
    }
  }
  xhttp.open("GET",url,false);
  xhttp.send();
  return data;
}

//Make an AJAX request to the server
function apiRequest(api,page) {
  var url="api/"+api+"?page="+page;
  var response = requestPage(url);
  var data = JSON.parse(response);
  return data;
}


//Get the name of all pages linked to by a page
function getSubPages(page) {
  return links = apiRequest("links",page);
}

//Get the name of the wikipedia article for a query
function getPageName(query) {
  return apiRequest("pagename",query);
}

function getRandomName() {
  return requestPage("api/random");
}
