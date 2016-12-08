$("form").submit(function() {
  if($("#username").val() == "") {
    document.getElementById("usernameLabel").setAttribute("data-error", "Username can't be empty");
    $("#username").addClass("invalid");
    $("#username").prop("aria-invalid", "true");
    return false;
  }

  if($("#username").val().toLowerCase().indexOf("guest") >= 0) {
    document.getElementById("usernameLabel").setAttribute("data-error", "Username can't contain 'guest' keyword");
    $("#username").addClass("invalid");
    $("#username").prop("aria-invalid", "true");
    return false;
  }

  if($("#password").val() == "") {
    $("#password").addClass("invalid");
    $("#password").prop("aria-invalid", "true");
    return false;
  }

  if($("#password").val() != $("#confirmPassword").val()) {
    $("#confirmPassword").addClass("invalid");
    $("#confirmPassword").prop("aria-invalid", "true");
    return false;
  }
});
