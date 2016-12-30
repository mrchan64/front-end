var express = require("express");
var http = require("http");
var cors = require("cors");
var fs = require("fs");
var path = require("path");
var bodyParser = require("body-parser");
var session = require('client-sessions');
var jsonfile = require("jsonfile");
var io = require('socket.io');
var app = express();

var filesys = path.join(__dirname, "public");
var users = [];
var sessionSettings = {};

var frontend = "http://localhost:2000"

try{
	var obj = jsonfile.readFileSync('config.json');
	users = obj.users;
	sessionSettings = obj.session;
	filesys=obj.directory;
}
catch (err){
	console.log("No Config File Found");
	return;
}

app.use(cors());

app.use(session(sessionSettings));

app.use(bodyParser.urlencoded({
	extended: true
}))
app.use(bodyParser.json());

app.use(function(req, res, next){
	console.log(new Date()+" | Attempt to " + req.method+" "+req.url);
	next();
});

var server = http.createServer(app);

app.post('/login', function (req, res){
	if(req.body.client_id==null){
		res.json({
			"status": 0
		});
		return;
	}
	for(var i=0; i<users.length; i++){
		if(req.body.username === users[i].username && req.body.password === users[i].password){
			req.DashSession.username = users[i].username;
			users[i].client_id = req.body.client_id;
			res.json({
				"status": 1
			})
			io.emit(
				"active", users[i].client_id
			)
			return;
		}
	}
	res.json({
		"status": 0
	});
});

app.post('/checkLogin', function (req, res){
	for(var i=0; i<users.length; i++){
		if(users[i].client_id == req.body.client_id){
			res.json({
				"status": 1
			})
			return;
		}
	}
	res.json({
		"status": 0
	});
});

app.post('/children', function (req, res) {
	var src = req.body["directory"];
	var selected = src.split("/");
	selected = selected[selected.length-1];
	if(checkTampering(src)){
		console.log(new Date()+" | Tampered child request");
		res.json({"hi": "y u gotta be a bitch"});
		return;
	}
	src = path.join(filesys, src);
	if(checkInvalidAddress(src)){
		console.log(new Date()+" | Invalid address for child request");
		res.json({"error": "invalid"});
		return;
	}
	if(fs.statSync(src).isDirectory()){
		var retSon = {"children": getChildren(src)};
		console.log(new Date()+" | Requested child is a valid directory");
		res.json(retSon);
		return;
	}
	if(isImage(selected)){
		console.log(new Date()+" | Requested child is a valid image");
		res.sendFile(src);
		return;
	}
	console.log(new Date()+" | Child request failed");
});

server.listen(3000, function () {
	console.log(new Date()+" | Backend server started");
});

function checkLogin(req){
	if(req.DashSession && req.DashSession.username){
		for(var i=0; i<users.length; i++){
			if(req.DashSession.username === users[i].username){
				return true;
			}
		}
	}
	return false;
}

function getChildren(src){
	var childrenNodes = [];
	var children = fs.readdirSync(src);
	var files = [];
	var images = [];
	for(var i=0; i<children.length; i++){
		if(fs.statSync(path.join(src, children[i])).isDirectory()){
			childrenNodes.push({
				"name": children[i],
				"type": "folder"
			});
		}else if(isImage(children[i])){
			images.push({
				"name": children[i],
				"type": "image"
			})
		}else{
			files.push({
				"name": children[i],
				"type": "file"
			})
		}
	}
	Array.prototype.push.apply(childrenNodes, images);
	Array.prototype.push.apply(childrenNodes, files);
	var nFolder = {
		"name": "New Folder",
		"type": "new"
	}
	childrenNodes.push(nFolder);
	return childrenNodes;
}

function checkTampering(src){
	var tokenized = src.split("/");
	if(tokenized.indexOf("..") >= 0){
		return true;
	}
	return false;
}

function checkInvalidAddress(src){
	try{
		var exists = fs.statSync(src);
	}catch(e){
		return true;
	}
	return false;
}

function isImage(fname){
	var validImageExtensions = ["png", "jpg", "jpeg", "ico"];
	var ext = fname.split('.');
	var extension = ext[ext.length-1];
	for(var i = 0; i<validImageExtensions.length; i++){
		if(extension == validImageExtensions[i]){
			return true;
		}
	}
	return false;
}

io = io.listen(server);
io.sockets.on('connection', function(socket){
	console.log(new Date()+" | "+socket.handshake.address+" has connected");
});
io.sockets.on('emit', function(data){
	console.log(new Date()+" | Sent "+JSON.stringify(data));
});
io.sockets.on('disconnect', function(socket){
	console.log(new Date()+" | "+socket.handshake.address+" has disconnected")
});