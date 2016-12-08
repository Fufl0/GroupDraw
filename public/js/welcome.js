var form = window.document.getElementById('loginForm');
form.onsubmit = function formOnSubmit(e) {
  e.preventDefault();
};

//POST
var username = window.document.getElementById('username');
var password = window.document.getElementById('password');
var loginButton = window.document.getElementById('loginButton');
var guestButton = window.document.getElementById('guest');

loginButton.onclick = function btnSubmitOnClick(e) {
  console.log('loginButton clicked');
  var user = {
    username: username.value,
    password: password.value,
  };
  var r = new XMLHttpRequest();
  if (username.value.toLowerCase().indexOf("guest") >= 0) {
    alert("Can't login as guest");
  } else {
    r.open('POST', '/welcome');
    r.setRequestHeader('Content-Type', 'application/json');
    r.setRequestHeader('Accept', 'application/json');
    r.onreadystatechange = function onReadyStateChange() {
      if (r.readyState !== 4) return;
      if (r.readyState === 4 && r.status === 200) {
        window.location = '/rooms';
      }
    };
    r.send(JSON.stringify(user));
  }
};

guestButton.onclick = function btnSubmitOnClick(e) {
  console.log('guestButton clicked');
  var guestname = 'Guest' + Math.floor((Math.random() * 100000) + 1);
  var user = {
    username: guestname,
    password: ''
  };
  var r = new XMLHttpRequest();
  r.open('POST', '/register');
  r.setRequestHeader('Content-Type', 'application/json');
  r.setRequestHeader('Accept', 'application/json');
  r.send(JSON.stringify(user));
  setTimeout(function () {
    var r = new XMLHttpRequest();
    r.open('POST', '/welcome');
    r.setRequestHeader('Content-Type', 'application/json');
    r.setRequestHeader('Accept', 'application/json');
    r.onreadystatechange = function onReadyStateChange() {
      if (r.readyState !== 4) return;
      if (r.readyState === 4 && r.status === 200) {
        window.location = '/rooms';
      }
    };
    r.send(JSON.stringify(user));
  }, 10);
};
