var tileWidth = 100;
var tileHeight = 300;
var minMargin = 40;
var cursorSpace = 10;

var height = $(window).height();
var width = $(window).width();

var canvas = $("#tileable");
$(canvas).css({position: 'absolute'});

var tiles = [];
block_example();
//$(window).on('mousemove', tile_update_example);

function block_example() {
	var block = $("<div></div>");
	block.css({top: 500, left: 1000, width: 400, height: 400, position: 'absolute'});
	block.css("background-color", "#000");
	var tile = new Tileable(block);
	$(canvas).append(block);
}

function tile_example() {
	var tileXNum = Math.floor((width - cursorSpace - minMargin)/(tileWidth + minMargin));
	var tileYNum = Math.floor((height - cursorSpace - minMargin)/(tileHeight + minMargin));

	var marginX = (width - cursorSpace - tileXNum * tileWidth)/(tileXNum + 1);
	var marginY = (height - cursorSpace - tileYNum * tileHeight)/(tileYNum + 1);

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

function tile_update_example(event) {
	tiles.forEach(function(element){
		element.update(event.clientX, event.clientY);
	});
}

function window_resize(event) {
	height = $(window).height();
	width = $(window).width();
}

function Tileable() {
	var e=this;
	this.margin = 10;

	this.init1 = function(x, y, w, h){
		this.x = x;
		this.y = y;
		this.width = w;
		this.height = h;
		this.element = $("<div></div>");
		this.element.css({top: this.y, left: this.x, width: this.width, height: this.height, position: 'absolute'});
		this.element.css("background-color", "#000");
		this.element.data("obj", this);
		$(window).on('mousemove', function(event){
			e.update(event.clientX, event.clientY);
		});
	}

	this.init2 = function(obj){
		this.element = $(obj);
		this.element.css("position", "absolute");
		this.x = pixel_to_number(this.element.css("left"));
		this.y = pixel_to_number(this.element.css("top"));
		this.width = pixel_to_number(this.element.css("width"));
		this.height = pixel_to_number(this.element.css("height"));
		this.element.data("obj", this);
		$(window).on('mousemove', function(event){
			e.update(event.clientX, event.clientY);
		});
	}

	this.update = function(mouseX, mouseY){
		if(mouseX<this.x){
			this.element.css("left", this.x+cursorSpace+this.margin*((this.x-mouseX)/width));
		}else if(mouseX>this.x+cursorSpace+this.width){
			this.element.css("left", this.x-this.margin*(mouseX-this.x-this.width)/width);
		}else{
			this.element.css("left", this.x+cursorSpace*position_curve((mouseX-this.x)/(cursorSpace+this.width)));
		}
		if(mouseY<this.y){
			this.element.css("top", this.y+cursorSpace+this.margin*((this.y-mouseY)/height));
		}else if(mouseY>this.y+cursorSpace+this.height){
			this.element.css("top", this.y-this.margin*(mouseY-this.y-this.height)/height);
		}else{
			this.element.css("top", this.y+cursorSpace*position_curve((mouseY-this.y)/(cursorSpace+this.height)));
		}
	}

	switch(arguments.length){
		case 4:
			this.init1.apply(this, arguments);
			break;
		case 1:
			this.init2.apply(this, arguments);
			break;
		default:
			console.log("Tile init failed");
	}
}

function position_curve(input){
	if(input < .05){
		return 1;
	}
	if(input > .95){
		return 0;
	}
	if(input < .5){
		return -.2*Math.log(2*input)+.5;
	}else{
		return .2*Math.log(-2*input+2)+.5;
	}
}

function pixel_to_number(value){
	return parseInt(value.substring(0,value.length-2));
}