var tileWidth = 100;
var tileHeight = 100;
var minMargin = 40;
var cursorSpace = 10;

var canvas = $("#tileable");
$(canvas).css({position: 'absolute'});
$(canvas).addClass("example-manager");
var tileManager = new TileableManager(canvas);
tile_example();

function block_example() {
	var block = $("<div></div>");
	block.css({top: 500, left: 1000, width: 400, height: 400, position: 'absolute'});
	block.css("background-color", "#000");
	var tile = new Tileable(block);
}

function tile_example() {
	var tileXNum = Math.floor((tileManager.width - cursorSpace - minMargin)/(tileWidth + minMargin));
	var tileYNum = Math.floor((tileManager.height - cursorSpace - minMargin)/(tileHeight + minMargin));

	var marginX = (tileManager.width - cursorSpace - tileXNum * tileWidth)/(tileXNum + 1);
	var marginY = (tileManager.height - cursorSpace - tileYNum * tileHeight)/(tileYNum + 1);

	var tileYIndex = 0;
	for(i = 0; i<tileYNum; i++){
		tileYIndex += marginY;
		var tileXIndex = 0;
		for(j = 0; j<tileXNum; j++){
			tileXIndex += marginX;
			var tile = new Tileable(tileXIndex, tileYIndex, tileWidth, tileHeight);
			tileXIndex += tileWidth;
		}
		tileYIndex += tileHeight;
	}
}

function Tileable() {
	var e=this;
	this.margin = 10;
	this.expansion = 1.01;
	this.lastStaticMove = {x:0, y:0};

	this.init1 = function(x, y, w, h){
		this.x = x;
		this.y = y;
		this.width = w;
		this.height = h;
		this.element = $("<div></div>");
		this.element.css({top: this.y, left: this.x, width: this.width, height: this.height});
		this.element.addClass("example-block");
		this.element.data("obj", this);
		this.manager = tileManager;
		this.manager.tiles.unshift(this);
		this.manager.element.append(this.element);
	}

	this.init2 = function(obj){
		this.element = $(obj);
		this.element.css("position", "absolute");
		this.x = pixel_to_number(this.element.css("left"));
		this.y = pixel_to_number(this.element.css("top"));
		this.width = pixel_to_number(this.element.css("width"));
		this.height = pixel_to_number(this.element.css("height"));
		this.element.data("obj", this);
		this.manager = tileManager;
		this.manager.tiles.unshift(this);
		this.manager.element.append(this.element);
	}

	this.update = function(mouseX, mouseY){
		if(mouseX<this.x){
			this.element.css("left", this.x+cursorSpace+this.margin*((this.x-mouseX)/this.manager.width));
		}else if(mouseX>this.x+cursorSpace+this.width){
			this.element.css("left", this.x-this.margin*(mouseX-this.x-this.width)/this.manager.width);
		}else{
			this.lastStaticMove.x = cursorSpace*position_curve((mouseX-this.x)/(cursorSpace+this.width))
			this.element.css("left", this.x+this.lastStaticMove.x);
		}
		if(mouseY<this.y){
			this.element.css("top", this.y+cursorSpace+this.margin*((this.y-mouseY)/this.manager.height));
		}else if(mouseY>this.y+cursorSpace+this.height){
			this.element.css("top", this.y-this.margin*(mouseY-this.y-this.height)/this.manager.height);
		}else{
			this.lastStaticMove.y = cursorSpace*position_curve((mouseY-this.y)/(cursorSpace+this.height))
			this.element.css("top", this.y+this.lastStaticMove.y);
		}
	}

	this.fmove = function(){
		this.element.css("width", this.width*this.expansion);
		this.element.css("height", this.height*this.expansion);
		this.move();
	}

	this.move = function(){
		this.element.css("left", this.x+this.lastStaticMove.x-this.width*(this.expansion-1)/2);
		this.element.css("top", this.y+this.lastStaticMove.y-this.height*(this.expansion-1)/2);
	}

	this.unmove = function(){
		this.element.css("width", this.width);
		this.element.css("height", this.height);
		this.element.css("left", this.x+this.lastStaticMove.x);
		this.element.css("top", this.y+this.lastStaticMove.y);
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

function TileableManager(obj) {
	this.element = obj;
	this.element.data("obj", this);

	this.height = $(obj).height();
	this.width = $(obj).width();

	this.tiles = [];
	var e = this;

	this.selected = null;
	this.lastStaticMove = {x:0, y:0};
	this.tile_selected = function(event) {
		if(e.selected == null){
			e.lastStaticMove = {x:event.clientX, y:event.clientY};
			for(i=0; i<e.tiles.length; i++){
				var t = e.tiles[i]
				var x = pixel_to_number(t.element.css("left"));
				var y = pixel_to_number(t.element.css("top"));
				var width = pixel_to_number(t.element.css("width"));
				var height = pixel_to_number(t.element.css("height"));
				if(x<event.clientX && x+width>event.clientX && y<event.clientY && y+height>event.clientY){
					e.selected = t;
					e.tiles.splice(i,1);
					break;
				}
				if(i+1 >= e.tiles.length){
					return;
				}
			}
			e.selected.fmove();
			e.selected.element.detach();
			$(obj).append(e.selected.element);
			e.tiles.unshift(e.selected);
		}
	}
	this.tile_deselected = function(event) {
		if(e.selected == null)return;
		e.selected.unmove();
		e.selected = null;
	}

	this.tile_update = function(event) {
		if(e.selected == null){
			e.tiles.forEach(function(element){
				element.update(event.clientX, event.clientY);
			});
		}else{
			e.selected.x += event.clientX-e.lastStaticMove.x;
			e.selected.y += event.clientY-e.lastStaticMove.y;
			e.lastStaticMove = {x:event.clientX, y:event.clientY};
			e.selected.move();
			var first = true;
			e.tiles.forEach(function(element){
				if(first){
					first = false;
				}else{
					element.update(event.clientX, event.clientY);
				}
			});
		}
	}

	this.window_resize = function(event) {
		this.height = $(obj).height();
		this.width = $(obj).width();
	}

	$(window).on('mousemove', this.tile_update);
	$(window).on('mousedown', this.tile_selected);
	$(window).on('mouseup', this.tile_deselected);
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