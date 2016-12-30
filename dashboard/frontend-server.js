var express = require("express");
var http = require("http");
var session = require('client-sessions');
var cors = require('cors');
var jsonfile = require("jsonfile");
var Cookies = require("cookies");
var io = require("socket.io-client");
var sessionSettings = {};

var unactivatedTokens = [];
var activatedTokens = [];

try{
	var obj = jsonfile.readFileSync('config.json');
	sessionSettings = obj.session;
}
catch (err){
	console.log("No Config File Found");
	return;
}

var ip = "http://localhost:3000";

app = express();

app.use(cors());

var server = http.createServer(app);

app.use(express.static('assets'));
app.use(express.static('dashboard-scripts'));
app.use(express.static('signin-scripts'));
app.use(express.static('../node_modules'));

app.get("/dashboard", function(req, res){
	var cookies = new Cookies(req,res);
	var client_id = cookies.get("client_id");
	if(activatedTokens.indexOf(client_id)>-1){
		res.sendFile(__dirname + '/dashboard.html');
	}else{
		res.redirect("/login");
	}
});

app.get("/login", function(req, res){
	var cookies = new Cookies(req,res);
	var id = randomString(10);
	unactivatedTokens.push(id);
	cookies.set("client_id",id,{httpOnly:false, maxAge:3600000});
	res.sendFile(__dirname + "/signin.html");
});

app.get("/api", function(req, res){
	res.json({"ip": ip});
});

server.listen(2000, function(){
	console.log("server started");
});

var socket = io.connect(ip,{reconnect: true});
socket.on('connect', function(){
	console.log(new Date()+" | Connected to API");
});
socket.on('active', function(data){
	console.log(new Date()+" | Activating token "+data);
	if(unactivatedTokens.indexOf(data)>-1){
		activatedTokens.push(unactivatedTokens[unactivatedTokens.indexOf(data)]);
	}else{
		if(activatedTokens.indexOf(data)<0){
			console.log(new Date()+" | Token "+data+" not found");
		}
	}
});
socket.on('disconnect', function(){
	console.log(new Date()+" | Disconnected from API");
});

function randomString(num){
	var ret = "";
	for(i = 0; i<num; i++){
		ret += Math.floor(Math.random()*10);
	}
	return ret;
}