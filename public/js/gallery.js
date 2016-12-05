// TODO is this function used?
// http://stackoverflow.com/questions/10726909/random-alpha-numeric-string-in-javascript
function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

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

/**
* Performs an XMLHttpRequest in a more developer friendly way
*/
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
    console.log()
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

function refreshGalleryImages(){
  request('/gallery', {
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

function deleteGalleryImage(id){
  request(`/rooms/${id}?secret=${localStorage.userId}`, {
    method: 'DELETE',
    headers: {
    'Accept': 'application/json'
    }
  }, function(err, res){
    if(err) throw err;

    refreshGalleryImages();
  });
}
