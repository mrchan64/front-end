var express = require("express");
var cors = require("cors");
var fs = require("fs");
var path = require("path");
var bodyParser = require("body-parser");
var session = require('client-sessions');
var jsonfile = require("jsonfile");
var app = express();

var filesys = path.join(__dirname, "public");
var obj = jsonfile.readFileSync('config.json');
var users = obj.users;;
var sessionSettings = obj.session;
app.use(cors());

app.use(session(sessionSettings));

app.use(bodyParser.urlencoded({
	extended: true
}))
app.use(bodyParser.json());

app.post('/login', function (req, res){
	for(var i=0; i<users.length; i++){
		if(req.body.username === users[i].username && req.body.password === users[i].password){
			req.DashSession.username = users[i].username;
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

app.get('/checkLogin', function (req, res){
	if(checkLogin(req)){
		res.json({
			"status": 1
		});
		return;
	}
	if(req.DashSession){
		req.DashSession.reset();
	}
	res.json({
		"status": 0
	});
});

app.post('/children', function (req, res) {
	console.log(req.body);

	var src = req.body["directory"];
	var selected = src.split("/");
	selected = selected[selected.length-1];
	if(checkTampering(src)){
		console.log("tamper");
		res.json({"hi": "y u gotta be a bitch"});
		return;
	}
	src = path.join(filesys, src);
	if(checkInvalidAddress(src)){
		console.log("invalid address");
		res.json({"error": "invalid"});
		return;
	}
	if(fs.statSync(src).isDirectory()){
		var retSon = {"children": getChildren(src)};
		console.log("is dir");
		res.json(retSon);
		return;
	}
	if(isImage(selected)){
		console.log("is image");
		res.sendFile(src);
		return;
	}
	console.log("something went wrong...");
});

app.listen(3000, function () {
	console.log('Server started');
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