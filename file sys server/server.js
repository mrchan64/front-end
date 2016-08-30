var express = require("express");
var cors = require("cors");
var app = express();

app.get('/children', cors(), function (req, res) {
	var numberVars = Math.floor(Math.random()*12)+1;
	var lul = [];
	for(var i = 0; i < numberVars; i++){
		var rand = JSON.stringify(Math.floor(Math.random()*10));
		lul.push(rand);
	}
	var retSon = {
		'hi': lul
	}
	res.json(retSon);
});

app.listen(3000, function () {
	console.log('Server started');
});