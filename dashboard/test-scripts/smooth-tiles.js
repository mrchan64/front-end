var tileWidth = 20;
var tileHeight = 20;
var minMargin = 10;
var cursorSpace = 20;

function initialize_tiles() {
	var height = $(window).height();
	var width = $(window).width();

	var tileXNum = Math.floor((width - cursorSpace - minMargin)/(tileWidth + minMargin));
	var tileYNum = Math.floor((hegiht - cursorSpace - minMargin)/(tileHeight + min Margin));

	var marginX = (width - cursorSpace - tileXNum * tileWidth)/(tileXNum + 1);
	var marginY = (height - cursorSpace - tileYNum * tileHeight)/(tileYNum + 1);

	var cursorX = 0;
	var cursorY = 0;

	var tileYIndex = 0;
	for(i = 0; i<tileYNum; i++){
		tileYIndex +=
	}
}

function Tileable(x, y, width, height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;

	this.update = function(){
		
	}
}