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
    if ( !(username.value.toLowerCase().indexOf("guest") >= 0) ) {
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
              window.location = '/welcome';
            }
            if (r.readyState === 4 && r.status === 500) {
              document.getElementById("usernameLabel").setAttribute("data-error", "Username already in use");
              $("#username").addClass("invalid");
              $("#username").prop("aria-invalid", "true");
            }
          };
          r.send(JSON.stringify(user));
        } else {
          $("#confirmPassword").addClass("invalid");
          $("#confirmPassword").prop("aria-invalid", "true");
        }
      } else {
        $("#password").addClass("invalid");
        $("#password").prop("aria-invalid", "true");
      }
    } else {
      document.getElementById("usernameLabel").setAttribute("data-error", "Username can't contain 'guest' keyword");
      $("#username").addClass("invalid");
      $("#username").prop("aria-invalid", "true");
    }
  } else {
    document.getElementById("usernameLabel").setAttribute("data-error", "Username can't be empty");
    $("#username").addClass("invalid");
    $("#username").prop("aria-invalid", "true");
  }

};
