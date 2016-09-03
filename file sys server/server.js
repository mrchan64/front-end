var express = require("express");
var cors = require("cors");
var fs = require("fs");
var path = require("path");
var bodyParser = require("body-parser");
var app = express();

app.use(cors());
app.use(bodyParser.urlencoded({
	extended: true
}))
app.use(bodyParser.json());

app.post('/children', function (req, res) {
	console.log(req.body);
	var src = req.body["directory"];
	var retSon = {"children": getChildren(src)};
	res.json(retSon);
});

app.listen(3000, function () {
	console.log('Server started');
});

function getChildren(src){
	if(checkTampering(src)){
		return {"hi": "y u gotta be a bitch"};
	}
	src = path.join("../..", src);	//temp
	src = path.join(__dirname, src);
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