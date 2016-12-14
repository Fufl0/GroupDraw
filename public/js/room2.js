window.onload=function(){
  console.log(document.getElementById("photoButton").className);
  if (window.document.getElementById('guestCheck').innerHTML === ""){
    document.getElementById("photoButton").className += ' disabled';
    console.log(document.getElementById("photoButton").className);
  }
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

  xhr.onerror = function(err) {
    cb(err)
  };

  xhr.send(options.body);
}

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

function bindSubmit() {

  function submitNewImage(event) {

    event.preventDefault();

    var canvas = document.getElementById('canvas');

    var data = canvas.toDataURL();
    var contentType = 'image/png';

    let title = document.getElementById("titleInput").value;
    if(title == "") {
      title = "(untitled)";
    }

    const body = { img: { data, contentType },
                    title: title,
                    roomId: window.location.href.split("/")[4]
                  };

    request('/gallery', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=UTF-8'
      },
      body: JSON.stringify(body)
    }, function(err, res){
      if(err) throw err;
    });

    document.getElementById("titleInput").value = "";
    document.getElementById("titleInput").blur();
    $('#modal1').modal('close');

  };

  let titleForm = document.getElementById("titleForm");
  let submitBtn = document.getElementById("submitBtn");

  titleForm.onsubmit = submitNewImage;
  submitBtn.onclick = submitNewImage;

}


 document.getElementById("photoButton").onclick = function(){
    document.getElementById("titleInput").focus();
    $('#modal1').modal('open');
 };
 

 bindSubmit();
