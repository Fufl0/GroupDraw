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


function updateGallery() {

  window.localStorage.setItem("myImages", false);
  window.myImages = window.localStorage.getItem("myImages");

  request('/gallery', {
    headers: {
      'Accept': 'application/json'
    }
  }, function(err, res){
    if(err) throw err;

    dust.render('galleryitem', { gallery: res.body }, function(err, out){
      if(err) throw err;
      document.getElementById('galleryContainer').innerHTML = out;
    });
  });
}

function getMyImages() {

  window.localStorage.setItem("myImages", true);
  window.myImages = window.localStorage.getItem("myImages");

  request('/gallery?my=true', {
    headers: {
      'Accept': 'application/json'
    }
  }, function(err, res){
    if(err) throw err;
    console.log("hi");

    dust.render('galleryitems', { gallery: res.body }, function(err, out){
      if(err) throw err;
      document.getElementById('galleryContainer').innerHTML = out;
    });
  });
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

  if (window.myImages) {
    myImages += 'my=true&'
  }
  request('/gallery?' + myImages + query, {
    headers: {
      'Accept': 'application/json'
    }
  }, function(err, res){
    if(err) throw err;

    dust.render('galleryitems', { gallery: res.body }, function(err, out){
      if(err) throw err;
      document.getElementById('galleryContainer').innerHTML = out;
    });
  });
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
    console.log(xhr.getAllResponseHeaders())
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





window.onload = function() {
  document.getElementById("my-images").addEventListener('click', getMyImages);
  document.getElementById("all-images").addEventListener('click', updateGallery);
  document.getElementById("gallerySearchForm").onsubmit = filterGallery;
};
