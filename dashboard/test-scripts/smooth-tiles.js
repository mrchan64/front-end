var tileWidth = 100;
var tileHeight = 300;
var minMargin = 40;
var cursorSpace = 20;

var height = 0;
var width = 0;
var tileXNum = 0;
var tileYNum = 0;
var marginX = 0;
var marginY = 0;

var canvas = $("#tileable");
$(canvas).css({position: 'absolute'});

var tiles = [];
initialize_tiles();
$(window).on('mousemove', tile_update);

function initialize_tiles() {
	height = $(window).height();
	width = $(window).width();

	tileXNum = Math.floor((width - cursorSpace - minMargin)/(tileWidth + minMargin));
	tileYNum = Math.floor((height - cursorSpace - minMargin)/(tileHeight + minMargin));

	marginX = (width - cursorSpace - tileXNum * tileWidth)/(tileXNum + 1);
	marginY = (height - cursorSpace - tileYNum * tileHeight)/(tileYNum + 1);

	var tileYIndex = 0;
	for(i = 0; i<tileYNum; i++){
		tileYIndex += marginY;
		var tileXIndex = 0;
		for(j = 0; j<tileXNum; j++){
			tileXIndex += marginX;
			var tile = new Tileable(tileXIndex, tileYIndex, tileWidth, tileHeight);
			$(canvas).append(tile.element);
			tiles[tiles.length] = tile;
			tileXIndex += tileWidth;
		}
		tileYIndex += tileHeight;
	}
}

function tile_update(event) {
	tiles.forEach(function(element){
		element.update(event.clientX, event.clientY);
	});
}

function Tileable(x, y, w, h) {
	this.x = x;
	this.y = y;
	this.width = w;
	this.height = h;

	this.element = $("<div></div>");
	this.element.css({top: this.y, left: this.x, width: this.width, height: this.height, position: 'absolute'});
	this.element.css("background-color", "#000");

	this.element.data("objectAssoc", this);

	this.update = function(mouseX, mouseY){
		if(mouseX<this.x){
			this.element.css("left", this.x+cursorSpace+minMargin*((this.x-mouseX)/width));
		}else if(mouseX>this.x+cursorSpace+this.width){
			this.element.css("left", this.x-minMargin*(mouseX-this.x-this.width)/width);
		}else{
			this.element.css("left", this.x+cursorSpace*position_curve((mouseX-this.x)/(cursorSpace+this.width)));
		}
		if(mouseY<this.y){
			this.element.css("top", this.y+cursorSpace+minMargin*((this.y-mouseY)/height));
		}else if(mouseY>this.y+cursorSpace+this.height){
			this.element.css("top", this.y-minMargin*(mouseY-this.y-this.height)/height);
		}else{
			this.element.css("top", this.y+cursorSpace*position_curve((mouseY-this.y)/(cursorSpace+this.height)));
		}
	}
}

function position_curve(input){
	if(input < .01){
		return 1;
	}
	if(input > .99){
		return 0;
	}
	if(input < .5){
		return -.2*Math.log(2*input)+.5;
	}else{
		return .2*Math.log(-2*input+2)+.5;
	}
}