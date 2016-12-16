var form = window.document.getElementById('profileForm');
form.onsubmit = function formOnSubmit(e) {
  e.preventDefault();
};

//POST

var img = ''

File.prototype.convertToBase64 = function(callback){
  var reader = new FileReader();
  reader.onload = function(e) {
    callback(e.target.result)
  };
  reader.onerror = function(e) {
    callback(null);
  };
  reader.readAsDataURL(this);
};

$("#imageInput").on('change',function(){
  console.log('cahnges');
  var selectedFile = this.files[0];
  selectedFile.convertToBase64(function(base64){
    img = base64;
  })
});

var saveButton = window.document.getElementById('saveButton');

saveButton.onclick = function btnSubmitOnClick(e) {

  var username = window.document.getElementById('username');

  var mood = '';
  if (window.document.getElementById('mood') !== '') {
    mood = window.document.getElementById('mood');
  } else {
    mood = window.document.getElementById('mood').placeholder;
  }

  var e = window.document.getElementById("statusSelect");
  var strUser = e.options[e.selectedIndex].value;

  if (strUser === '') {
    strUser = e.options[e.selectedIndex].text;
  }

  if (img === '') {
    img = window.document.getElementById("proPic").src;
  }

  console.log('saveBtn clicked');

  var user = {
    username: username.innerHTML,
    mood: mood.value,
    status: strUser,
    picture: img
  };
  var r = new XMLHttpRequest();
  r.open('POST', '/profile');
  r.setRequestHeader('Content-Type', 'application/json');
  r.setRequestHeader('Accept', 'application/json');
  console.log(user);
  r.send(JSON.stringify(user));

  // alert('Your account has been updated.');
  Materialize.toast('Your account has been updated.', 4000) // 4000 is the duration of the toast
};

//DELETE USER

var deleteButton = window.document.getElementById('deleteButton');

deleteButton.onclick = function btnSubmitOnClick(e) {

  var username = window.document.getElementById('username');
  console.log('deleteBtn clicked');

  var user = {
    username: username.innerHTML
  };

  var r = new XMLHttpRequest();
  r.open('DELETE', '/profile');
  r.setRequestHeader('Content-Type', 'application/json');
  r.setRequestHeader('Accept', 'application/json');
  r.send(JSON.stringify(user));

  window.location = '/welcome';
}
