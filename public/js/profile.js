var form = window.document.getElementById('profileForm');
form.onsubmit = function formOnSubmit(e) {
  e.preventDefault();
};

//POST
var img = window.document.getElementById('imageInput').files[0];
var username = window.document.getElementById('username');
var mood = window.document.getElementById('mood');
var e = window.document.getElementById("statusSelect");
var strUser = e.options[e.selectedIndex].value;
var saveButton = window.document.getElementById('saveButton');

saveButton.onclick = function btnSubmitOnClick(e) {
  console.log('saveBtn clicked');
  // var formData = new FormData();
  // formData.append('image', img, img.name);
  var user = {
    username: username.innerHTML,
    mood: mood.value,
    status: strUser,
    //picture: img
  };
  var r = new XMLHttpRequest();
  r.open('POST', '/profile');
  r.setRequestHeader('Content-Type', 'application/json');
  r.setRequestHeader('Accept', 'application/json');
  console.log(user);
  r.send(JSON.stringify(user));
  // r.write(formData);
  //r.end()
};
