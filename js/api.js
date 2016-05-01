// This script contains the code necessary to make requests to the python API,
// as well as a more general function which is also used to fetch the README
// for rendering.

var api_endpoint = "http://luke.deentaylor.com/wikipedia/api/";

//Make a synchronous request and return the response
function requestPage(url, onSuccess) {
  var data = null;
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      onSuccess(xhttp.responseText);
    }
  };
  xhttp.open("GET",url,true);
  xhttp.send();
}

//Make an AJAX request to the server while passing a page
function apiRequest(api,page,onSuccess) {
  var url=api_endpoint+api+"?page="+page;
  requestPage(url, function (data){
    onSuccess(JSON.parse(data));
  });
}


//Get the name of all pages linked to by a page
function getSubPages(page,onSuccess) {
  apiRequest("links",page,onSuccess);
}

//Get the name of the wikipedia article for a query
function getPageName(query,onSuccess) {
  apiRequest("pagename",query,onSuccess);
}

function getRandomName(onSuccess) {
  requestPage("api/random", function(resp){
    getPageName(resp,onSuccess);
  });
}

function getSuggestions(text, onSuccess) {
  requestPage("api/suggest"+"?text="+text, function(data) {
    onSuccess(JSON.parse(data));
  });
}
