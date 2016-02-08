
//Generic function to make a request to my flask Wikipedia API
function apiRequest(api,page) {
  var url="api/".concat(api).concat("?page=").concat(page);

  var data = null;

  $.ajax({
    url: url,async: false, dataType: 'json',
    success: function (json) {
      data = json;
    },
    error: function (jqXHR,Exception) {
      if (jqXHR.status === 500) {
        console.log("500")
        data = null;
      }
    },
  });

  return data;
}



//Get the name of all pages linked to by a page
function getSubPages(page) {
  return apiRequest("links",page);
}

//Get the name of the wikipedia article for a query
function getPageName(query) {
  return apiRequest("pagename",query);
}
