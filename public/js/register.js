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
  if (username.value !== '' && !(username.value.toLowerCase().indexOf("guest") >= 0) ) {
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
        r.onreadystatechange = function onReadyStateChange() {
          if (r.readyState !== 4) return;
          if (r.readyState === 4 && r.status === 201) {
            alert("You succesfully registered, have fun :)");
            window.location = '/welcome';
          }
          if (r.readyState === 4 && r.status === 500) {
            alert("Username already in use!");
          }
        };
        r.send(JSON.stringify(user));
      } else {
        alert("Passwords do not match!");
      }
    } else {
      alert("Password can't be empty!");
    }
  } else {
    alert("Username can't be empty/can't contain 'guest' keyword.");
  }

};
