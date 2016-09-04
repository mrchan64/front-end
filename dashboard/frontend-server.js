var express = require("express");
var http = require("http");

app = express();

var server = http.createServer(app);

app.use(express.static('assets'));
app.use(express.static('scripts'));
app.use(express.static('../node_modules'));

app.get("/dashboard", function(req, res){
	res.sendFile(__dirname + '/dashboard.html');
});

app.get("/login", function(req, res){
	res.sendFile(__dirname + "/signin.html");
});

app.get("/api", function(req, res){
	var ip = "http://24.6.23.177:3000";
	//code for getting ip
	res.json({"ip": ip});
});

server.listen(2000);