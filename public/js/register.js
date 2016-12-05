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
  console.log('submitBtn clicked');
  if (username.value !== '') {
    if (password.value !== '') {
      if (password.value === confirmPassword.value) {
        var user = {
          username: username.value,
          password: password.value,
        };
        var r = new XMLHttpRequest();
        r.open('POST', '/register');
        r.setRequestHeader('Content-Type', 'application/json');
        r.setRequestHeader('Accept', 'application/json');
        r.send(JSON.stringify(user));
        alert("You succesfully registered, have fun :)");
        window.location = '/welcome';
      } else {
        alert("Passwords do not match!");
      }
    } else {
      alert("Password can't be empty!");
    }
  } else {
    alert("Username can't be empty!");
  }

};
