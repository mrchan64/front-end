var express = require("express");
var http = require("http");

app = express();
var server = http.createServer(app);

app.use(express.static('assets'));
app.use(express.static('scripts'));

app.get("/dashboard", function(reg, res){
	res.sendFile(__dirname + '/index.html');
});

server.listen(2000);