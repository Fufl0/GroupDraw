
  const socket = io();
  socket.on('reload', function(){
    console.log("REL");
    var r = new XMLHttpRequest();
    r.open('GET', '/users/list');
    r.setRequestHeader('Accept', 'application/json');
    r.onreadystatechange = function onReadyStateChange() {
      if (r.readyState !== 4) return;
      if (r.readyState === 4 && r.status === 200) {
        console.log(r.responseText);
        renderUsers(r.responseText);
      }
    }
    r.send();
  });


function renderUsers(users){
  const data = {
         "users": users
     };

   dust.render("useritems", data, function(err, out) {

       console.log(err);
       const content = document.getElementById("userList");

       content.innerHTML = out;

   });
}
