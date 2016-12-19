function doJSONRequest(method, url, data, callback) {
  let req = new XMLHttpRequest();
  req.open(method, url, true);
  req.onreadystatechange = function() {
    if (req.readyState  === 4) {
      if (req.status === 200 || req.status === 201)
	     callback(JSON.parse(req.responseText));
      else if (req.status === 204)
	     callback();
      else
	     console.log("Request error: " + req.status);
     }
  };
  if (method === "POST" || method === "PUT")
    req.setRequestHeader("Content-Type", "application/json");
    req.send(JSON.stringify(data));
}

function bindSubmit() {

  document.getElementById("newRoomButton").onclick = function() {
    $('#modal1').modal('open');
  };

  document.getElementById('newPrivateRoomButton').onclick = function() {
    $('#modal2').modal('open');
  }

  function submitNewRoom(event) {
    event.preventDefault();
    let roomName = document.getElementById("roomNameInput").value;
    if(roomName == ""){
      roomName = document.getElementById("profileName").innerHTML + "'s Public Room";
    }
    document.getElementById("roomNameInput").value = '';
    doJSONRequest("POST", "/rooms", { name: roomName }, function(saved) {
      dust.render("roomitem", saved, function(err, room) {
        document.getElementById("roomList").innerHTML += room;
      });
      bindDelete();
    });
    $('#modal1').modal('close');
  };

  function submitNewPrivateRoom(event) {
    event.preventDefault();
    let roomName = document.getElementById("privateRoomNameInput").value;
    let roomPassword = document.getElementById("roomPasswordInput").value;
    if(roomName == ""){
      roomName = document.getElementById("profileName").innerHTML + "'s Private Room";
    }
    document.getElementById("privateRoomNameInput").value = '';
    document.getElementById("roomPasswordInput").value = '';
    doJSONRequest("POST", "/rooms", { name: roomName, password: roomPassword }, function(saved) {
      dust.render("roomitem", saved, function(err, room) {
        document.getElementById("roomList").innerHTML += room;
      });
      bindDelete();
    });
    $('#modal2').modal('close');
  }

  let roomForm = document.getElementById("roomForm");
  roomForm.onsubmit = submitNewRoom;
  let submitBtn = document.getElementById("submitBtn");
  submitBtn.onclick = submitNewRoom;
  let privateRoomForm = document.getElementById('privareRoomForm');
  privateRoomForm.onsubmit = submitNewPrivateRoom;
  let submitBtnPrivate = document.getElementById('submitBtnPrivate');
  submitBtnPrivate.onclick = submitNewPrivateRoom;

}

function bindDelete() {
  let roomList = document.getElementById("roomList");
  for (let room of roomList.children) {
	   let deleteBtn = room.children[0].children[4];
	   let id = deleteBtn.getAttribute("data-id");
	   deleteBtn.onclick = function() {
	      doJSONRequest("DELETE", "/rooms/" + id + "/" + window.secret, null, function() {
		      roomList.removeChild(room);
	      });
	   }
	 }
}

function bindPrivateCheck() {
  let roomList = document.getElementById("roomList");
  for (let room of roomList.children) {
	   let joinBtn = room.children[0].children[3];
	   joinBtn.onclick = function() {
        event.preventDefault();
        let roomLink = joinBtn.getAttribute("href");
        joinBtn.setAttribute("href", '');
        let roomName = room.children[0].children[0].innerHTML;
        let enteredPassword = room.children[0].children[2].children[0].value;
        var room = {
          name: roomName,
          password: enteredPassword
        };
        r.open('PUT', '/rooms');
        r.setRequestHeader('Content-Type', 'application/json');
        r.setRequestHeader('Accept', 'application/json');
        r.onreadystatechange = function onReadyStateChange() {
          if (r.readyState !== 4) return;
          if (r.readyState === 4 && r.status === 200) {
            joinBtn.setAttribute("href", roomLink);
            window.location = roomLink;
          }
          if (r.readyState === 4 && r.status === 404) {
            room.children[0].children[2].children[0].setAttribute("data-error", "Wrong password");
            room.children[0].children[2].children[0].addClass(" invalid");
            joinBtn.setAttribute("href", roomLink);
          }
        };
        r.send(JSON.stringify(room));
	   }
	 }
}

window.onload = function() {
    bindSubmit();
    bindDelete();

    let profile = document.getElementById("profileName");
        if(profile.innerHTML.toLowerCase().indexOf("guest") >= 0){
              let d = document.getElementById("newRoomButton");
              d.className += " disabled";

              let p = document.getElementById("newPrivateRoomButton");
              p.className += " disabled";
        }
};
