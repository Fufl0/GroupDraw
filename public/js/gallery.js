const Buffer = require('buffer').Buffer;

/**
* from https://gist.github.com/monsur/706839
* XmlHttpRequest's getAllResponseHeaders() method returns a string of response
* headers according to the format described here:
* http://www.w3.org/TR/XMLHttpRequest/#the-getallresponseheaders-method
* This method parses that string into a user-friendly key/value pair object.
*/
function parseResponseHeaders(headerStr) {
  var headers = {};
  if (!headerStr) {
    return headers;
  }
  var headerPairs = headerStr.split('\u000d\u000a');
  for (var i = 0; i < headerPairs.length; i++) {
    var headerPair = headerPairs[i];
    // Can't use split() here because it does the wrong thing
    // if the header value has the string ": " in it.
    var index = headerPair.indexOf('\u003a\u0020');
    if (index > 0) {
      var key = headerPair.substring(0, index);
      var val = headerPair.substring(index + 2);
      headers[key] = val;
    }
  }
  return headers;
}


function loadGallery() {

  window.localStorage.setItem("myImages", false);
  window.myImages = window.localStorage.getItem("myImages");

  request('/gallery?my=false', {
    headers: {
      'Accept': 'application/json'
    }
  }, renderResponse);
}

function getMyImages() {

  window.localStorage.setItem("myImages", true);
  window.myImages = window.localStorage.getItem("myImages");

  request('/gallery?my=true', {
    headers: {
      'Accept': 'application/json charset=utf-8'
    }
  }, renderResponse);
}

function filterGallery() {

  var filter = document.getElementById('search-by').value;
  var searchField = document.getElementById('gallerySearchFormInputField').value;
  var myImages = '';
  var query = '';

  if (filter == "Room") {
    query += 'room=' + searchField;
  }
  if (filter == "Author") {
    window.localStorage.setItem("myImages", false);
    window.myImages = window.localStorage.getItem("myImages");
    query += 'authorName=' + searchField;
  }
  if (filter == "Title") {
    query += 'title=' + searchField;
  }

  if (window.myImages == "true") {
    myImages += 'my=true&'
  }

  request('/gallery?' + myImages + query, {
    headers: {
      'Accept': 'application/json'
    }
  }, renderResponse);
}

function sortGallery() {

  var value = document.getElementById('sort-by').value;

  var sortCriteria = 'dateCreated'
  var sortBy = 'sortBy='

  if (value == 'Room') {
    sortCriteria = 'createdInRoom';
  }
  if (value == 'Title') {
    sortCriteria = 'title';
  }
  if (value == 'Author') {
    sortCriteria = 'author';
  }

  sortBy += sortCriteria;

  window.localStorage.setItem("sortCriteria", sortCriteria);
  window.sortCriteria = window.localStorage.getItem("sortCriteria");

  var filter = document.getElementById('search-by').value;
  var searchField = document.getElementById('gallerySearchFormInputField').value;
  var myImages = '';
  var query = '';

  if (filter == "Room") {
    query += 'room=' + searchField + '&';
  }
  if (filter == "Author") {
    window.localStorage.setItem("myImages", false);
    window.myImages = window.localStorage.getItem("myImages");
    query += 'authorName=' + searchField + '&';
  }
  if (filter == "Title") {
    query += 'title=' + searchField + '&';
  }
  if (window.myImages == "true") {
    myImages += 'my=true&'
  }

  request('/gallery?' + myImages + query + sortBy, {
    headers: {
      'Accept': 'application/json'
    }
  }, renderResponse);
}



function request(url, opts, cb){
  if(typeof opts == 'function'){
    cb = opts;
  }
  const defaultOptions = {
    method: 'GET',
    headers: {},
    body: null
  };

  const options = Object.assign({}, defaultOptions, opts)
  var xhr = new XMLHttpRequest();
  xhr.open(options.method, url);

  // set headers
  Object.keys(options.headers).forEach( k => {
    xhr.setRequestHeader(k, options.headers[k]);
  })

  xhr.responseType = 'json';

  xhr.onload = function() {
    cb(null, {
      status: xhr.status,
      body: xhr.response,
      headers: parseResponseHeaders(xhr.getAllResponseHeaders())
    });
  };

  xhr.onerror = function() {
    cb(err)
  };

  xhr.send(options.body);
}

function renderResponse(err, res) {
  if(err) throw err;

  var galleryImagesArray = res.body;

  var galleryImagesToRender = [];

  for (let i = 0; i < galleryImagesArray.length; i++) {
    let newGalleryImage = {};

    newGalleryImage.img = {};
    newGalleryImage.img.data = Buffer.from(galleryImagesArray[i].img.data.data); // TODO
    newGalleryImage.img.contentType = galleryImagesArray[i].img.contentType;
    newGalleryImage.title = galleryImagesArray[i].title;
    newGalleryImage.author = galleryImagesArray[i].author;
    newGalleryImage.dateCreated = galleryImagesArray[i].dateCreated;
    newGalleryImage.createdInRoom = galleryImagesArray[i].createdInRoom;

    galleryImagesToRender.push(newGalleryImage);
  }

  dust.render('galleryitems', { gallery: galleryImagesToRender }, function(err, out) {
    if(err) throw err;
    document.getElementById('lightgallery').innerHTML = out;
    reloadScripts();
  });
}


function reloadScript(scriptSrc) {
  var head = document.getElementsByTagName('head')[0];
  var script = document.createElement('script');
  script.className = "reloadedScripts";
  script.type = 'text/javascript';
  script.src = scriptSrc.src;
  head.appendChild(script);
}

function reloadScripts() {

  var reloadedScripts = document.getElementsByClassName("reloadedScripts");
  if (reloadedScripts.length !== 0) {
    var head = document.getElementsByTagName('head')[0];
    for (let i = 0; i < reloadedScripts.length; i++) {
      head.removeChild(reloadedScripts[i]);
    }
  }

  var scriptList = document.getElementsByClassName("scriptToReload");

  for (let i = 0; i < scriptList.length; i++) {
    reloadScript(scriptList[i]);
  }
}





window.onload = function() {
  document.getElementById("my-images").addEventListener('click', getMyImages);
  document.getElementById("all-images").addEventListener('click', loadGallery);
  document.getElementById("gallerySearchForm").onsubmit = function(e) {
    e.preventDefault();
    filterGallery();
  };
  document.getElementById("sort-by").onchange = sortGallery;

  window.localStorage.setItem("sortCriteria", 'dateCreated');
  window.sortCriteria = window.localStorage.getItem("sortCriteria");
};
