// This script contains the code necessary to make requests to the python API,
// as well as a more general function which is also used to fetch the README
// for rendering.



// GLOBALS

var api_endpoint = "https://wikipedia-map.now.sh/";



// BASIC METHODS

//Make an asynchronous GET request and execute the onSuccess callback with the data
function requestPage(url, onSuccess) {
  onSuccess = onSuccess || function(){};
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      onSuccess(xhttp.responseText);
    }
  };
  xhttp.open("GET", url, true);
  xhttp.send();
}

// Send an asynchronous POST request to store data
function postData(url, data, onSuccess) {
  onSuccess = onSuccess || function(){};
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      onSuccess(xhttp.responseText);
    }
  };
  xhttp.open("POST", url, true);
  xhttp.send(data);
}

// Send an AJAX GET request to the server, passing the name of a Wikipedia page
function apiRequest(api, page, onSuccess) {
  var url=api_endpoint+api+"?page="+page;
  requestPage(url, function (data){
    onSuccess(JSON.parse(data));
  });
}

// API calls

// WIKIPEDIA PARSING ----------

//Get the name of all pages linked to by a page
function getSubPages(page,onSuccess) {
  apiRequest("links",page,onSuccess);
}

//Get the name of the wikipedia article for a query
function getPageName(query,onSuccess) {
  apiRequest("pagename",query,onSuccess);
}

function getRandomName(onSuccess) {
  requestPage(api_endpoint + "random", function(resp){
    getPageName(resp,onSuccess);
  });
}

// GRAPH STORAGE / RETRIEVAL ----------

function storeJSON(data, onSuccess) {
  postData(api_endpoint + "storejson", data, onSuccess);
}

function getJSON(id, onSuccess) {
  requestPage("http://luke.deentaylor.com/wikipedia/graphs/" + id, onSuccess);
}
