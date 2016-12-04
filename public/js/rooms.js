	//  Enter your clientside JavaScript code for the rooms page here

window.onload = function(){
	setDelete();
	setCreate();

	if (!localStorage.getItem("token")){
		localStorage.setItem("token", Date.now());
	}
}
function doJSONRequest(method, url, headers, data, callback){

   if (data !== undefined){
	   if (data !== null && data.toString() !== "[object Object]") {
			   throw "Invalid JSON data.";
	   }
   }
	if(arguments.length != 5 || method === "HEAD"  ){
	   throw "error";
	}

   else if ((method === "GET")||(method === "POST")||(method === "PUT")||(method === "DELETE")){


	   let request = new XMLHttpRequest();
	   request.open(method, url, true);
	   if (method === "PUT" || method === "POST"){
		   request.setRequestHeader("Content-Type", "application/json;charset=utf-8");
	   }
	   if (headers){
		   for(let header in headers) { request.setRequestHeader(header, headers[header]); }
	   }

	   //request.setRequestHeader("Accept","application/json");

	   request.onreadystatechange = function(){
		   if (request.readyState == 4){

			   if (request.status == 200 || request.status == 201){
				   callback(JSON.parse(request.responseText));
			   }
			   if (request.status == 204){
				   callback();
			   }
		   }
	   }
	   request.send(JSON.stringify(data));
   }
}


function setDelete() {
	let del = document.getElementsByClassName("delete");
	for (let temp of del){
		temp.onclick = function(ev){
			ev.preventDefault();
			doJSONRequest("DELETE", "/rooms/"+ev.target.dataset.id+"/"+localStorage.getItem("token"), {}, {}, function () {
				document.getElementById("roomList").removeChild(ev.target.parentNode);
			});
		}
	}
}


function setCreate() {
	let sub = document.getElementById("submitBtn");
		sub.onclick = function(ev){	
			ev.preventDefault();
			let form = document.getElementById("roomNameInput").value;
			document.getElementById("roomNameInput").value="";
				doJSONRequest("POST", "/rooms/", {}, {name : form, secret : localStorage.getItem("token")}, function (data) {
				data.links = [{href : "/rooms/"+data["_id"]}]
				dust.render("roomitem", data, function(err, obj) {
					document.getElementById("roomList").innerHTML+=obj;
					setDelete();
				});
			});
		}
}