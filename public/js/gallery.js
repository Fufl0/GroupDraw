function updateGallery(){
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


function updatePage(event) {
  updateGallery();
}




window.onpopstate = updatePage;
window.onload = updatePage;
