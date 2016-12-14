function doJSONRequest(method, url, data, callback) {
    let req = new XMLHttpRequest();
    req.open(method, url, true);
    req.onreadystatechange = function() {
	if (req.readyState  === 4) {
	    if (req.status === 200 || req.status === 201)
		callback(JSON.parse(req.responseText));
	    else if  (req.status === 204)
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

  function submitNewRoom(event) {
    event.preventDefault();
    let roomName = document.getElementById("roomNameInput").value;
    if(roomName == ""){
      roomName = "No Name Room";
    }
    doJSONRequest("POST", "/rooms", { name: roomName}, function(saved) {
      dust.render("roomitem", saved, function(err, room) {
        document.getElementById("roomList").innerHTML += room;
      });
      bindDelete();
    });
    $('#modal1').modal('close');
  };

  let roomForm = document.getElementById("roomForm");
  roomForm.onsubmit = submitNewRoom;
  let submitBtn = document.getElementById("submitBtn");
  submitBtn.onclick = submitNewRoom;
  
}

function bindDelete() {
    let roomList = document.getElementById("roomList");
    for (let room of roomList.children) {
	let deleteBtn = room.children[0].children[2];
	let id = deleteBtn.getAttribute("data-id");
	deleteBtn.onclick = function() {
	    doJSONRequest("DELETE", "/rooms/" + id + "/" + window.secret, null, function() {
		roomList.removeChild(room);
	    });
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
        }
};
