var form = window.document.getElementById('profileForm');
form.onsubmit = function formOnSubmit(e) {
  e.preventDefault();
};

//POST
// var img = ...
var username = window.document.getElementById('username');
var mood = window.document.getElementById('mood');
var e = document.getElementById("statusSelect");
var status = e.options[e.selectedIndex].value;
var saveButton = window.document.getElementById('saveButton');

saveButton.onclick = function btnSubmitOnClick(e) {
  console.log('saveBtn clicked');
  var user = {
    username: username.innerHTML,
    mood: mood.value,
    status: status
    // image: img.value
  };
  var r = new XMLHttpRequest();
  r.open('POST', '/profile');
  r.setRequestHeader('Content-Type', 'application/json');
  r.setRequestHeader('Accept', 'application/json');
  console.log(user);
  r.send(JSON.stringify(user));
};
