var form = window.document.getElementById('registerForm');
form.onsubmit = function formOnSubmit(e) {
  e.preventDefault();
};

//POST
var username = window.document.getElementById('username');
var password = window.document.getElementById('password');
var confirmPassword = window.document.getElementById('confirmPassword');
var registerButton = window.document.getElementById('registerButton');
registerButton.onclick = function btnSubmitOnClick(e) {
  console.log('asdf');
  alert("You succesfully registered, have fun :)");
  var user = {
    username: username.value,
    password: password.value,
  };

  var r = new XMLHttpRequest();
  r.open('POST', '/register');
  r.setRequestHeader('Content-Type', 'application/json');
  r.setRequestHeader('Accept', 'application/json');

  r.send(JSON.stringify(user));
};

// registerButton.onclick = function btnSubmitOnClick(e) {
//   if ((password.value === confirmPassword.value) && (password.value !== '')) {
//     var user = {
//       username: username.value,
//       password: password.value,
//     };
//
//     var r = new XMLHttpRequest();
//     r.open('POST', '/register');
//     r.setRequestHeader('Content-Type', 'application/json');
//     r.setRequestHeader('Accept', 'application/json');
//
//     r.send(JSON.stringify(user));
//     alert("You succesfully registered, have fun :)");
//
//   } else {
//     alert("The passwords do not match!");
//   }
// };
