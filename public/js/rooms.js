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

function generateSecret() {
    if (window.localStorage.getItem("secret") === null) {
	let secret = Math.floor(Math.random() * 1000000);
	window.localStorage.setItem("secret", secret);
    }
    window.secret = window.localStorage.getItem("secret");
}

function bindSubmit() {
    let submitBtn = document.getElementById("submitBtn");
    submitBtn.onclick = function(event) {
	event.preventDefault();
	let roomName = document.getElementById("roomNameInput").value;
	if(roomName == ""){
		roomName = "No Name Room";
	}
	doJSONRequest("POST", "/rooms", { name: roomName, secret: window.secret }, function(saved) {
	    dust.render("roomitem", saved, function(err, room) {
		document.getElementById("roomList").innerHTML += room;
	    });
	    bindDelete();
	});
    };
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
    generateSecret();
    bindSubmit();
    bindDelete();
}
