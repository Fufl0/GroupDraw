var form = window.document.getElementById('loginForm');
form.onsubmit = function formOnSubmit(e) {
  e.preventDefault();
};

//POST
var username = window.document.getElementById('username');
var password = window.document.getElementById('password');
var registerButton = window.document.getElementById('loginButton');

loginButton.onclick = function btnSubmitOnClick(e) {
  console.log('loginButton clicked');
    var user = {
      username: username.value,
      password: password.value,
    };
    var r = new XMLHttpRequest();
    r.open('POST', '/welcome');
    r.setRequestHeader('Content-Type', 'application/json');
    r.setRequestHeader('Accept', 'application/json');
    r.send(JSON.stringify(user));
};
