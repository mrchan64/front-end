var panels = 5;
var margin = 10;
var ymultiplier = 5;
var hovmultiplier = 8;
var clickmultiplier = 30

var width = $(window).width();

var dashboard = $("#stackable");
var panelManager = new PanelManager(dashboard);

function Icon(){
	
}

function Panel(obj, height, posy) {
	this.ymultiplier = ymultiplier;
	this.hovmultiplier = hovmultiplier;
	this.clickmultiplier = clickmultiplier;
	this.element = obj;
	this.w = width/80;
	this.width = this.w;
	this.h = height;
	this.height = this.h;
	this.x = width;
	this.posy = posy;
	this.y = this.posy
	this.element.data('obj', this);
	this.element.css({height: this.height, top: this.y, width: this.width});
	var radius = height/10;
	this.element.css("border-top-left-radius", radius);
	this.element.css("border-bottom-left-radius", radius);
	var e = this;

	this.checkOver = function(mouseX, mouseY){
		if(e.x-e.width<=mouseX && e.y<=mouseY && mouseY<=e.y+e.height){
			if(mouseX<e.x-e.width+radius && mouseY<e.y+radius){
				if(distance(mouseX, mouseY, e.x-e.width+radius, e.y+radius)<=radius){
					return true;
				}else{
					return false;
				}
			}
			if(mouseX<e.x-e.width+radius && mouseY>e.y+e.height-radius){
				if(distance(mouseX, mouseY, e.x-e.width+radius, e.y+e.height-radius)<=radius){
					return true;
				}else{
					return false;
				}
			}
			return true;
		}
		return false;
	}

	this.hov = false;
	this.cli = false;
	this.shi = false;

	this.hovered = function(){
		if(this.cli)return;
		this.hov = true;
		this.width = this.w*this.hovmultiplier;
		this.element.stop();
		this.element.animate({width: this.width}, 100);
	}

	this.unhovered = function(){
		if(this.cli)return;
		this.hov = false;
		this.width = this.w;
		this.element.stop();
		this.element.animate({width: this.width}, 100);
	}

	this.clicked = function(){
		this.hov = false;
		this.cli = true;
		this.shi = false;
		this.width = this.w*this.clickmultiplier;
		this.height = this.h*this.ymultiplier;
		this.y = this.posy;
		this.element.stop();
		this.element.animate({width: this.width, height: this.height, top: this.y}, 100);
		this.element.data('state', 'open');
	}

	this.unclicked = function(){
		this.cli = false;
		this.shi = false;
		this.width = this.w;
		this.height = this.h;
		this.y = this.posy;
		this.element.data('state', 'closed');
		this.element.stop();
		this.element.animate({width: this.width, height: this.height, top: this.y},100);
	}

	this.shifted = function(){
		this.cli = false;
		this.shi = true;
		this.width = this.w;
		this.height = this.h;
		this.y = this.posy + this.h*(this.ymultiplier-1);
		this.element.data('state', 'closed');
		this.element.stop();
		this.element.animate({width: this.width, height: this.height, top: this.y},100);
	}
}

function PanelManager(obj) {
	this.element = obj;
	this.panels = [];
	var e = this;

	var indexes = panels + ymultiplier - 1;
	var height = (this.element.height()-margin*(panels+1))/indexes;

	var posYindex = 0;
	for(i = 0; i<panels; i++){
		posYindex += margin
		var p = $("<div></div>");
		p.addClass("panel-base");
		var panel = new Panel(p, height, posYindex);
		this.panels[this.panels.length]=panel;
		this.element.append(panel.element);
		posYindex += height;
		p.data('state', 'closed');
		switch(i){
			case 2:
			p.attr('id','music-player');
		}
	}

	this.onHov = function(event){
		for(i = 0; i<e.panels.length; i++){
			if(e.panels[i].checkOver(event.clientX,event.clientY)){
				if(!e.panels[i].hov)e.panels[i].hovered();
			}else{
				if(e.panels[i].hov)e.panels[i].unhovered();
			}
		}
	}

	this.onCli = function(event){
		var shifting = false;
		for(i = 0; i<e.panels.length; i++){
			if(shifting){
				if(!e.panels[i].shi)e.panels[i].shifted();
				continue;
			}
			if(e.panels[i].checkOver(event.clientX,event.clientY)){
				if(!e.panels[i].cli)e.panels[i].clicked();
				shifting = true;
			}else{
				if(e.panels[i].shi || e.panels[i].cli)e.panels[i].unclicked();
			}
		}
	}

	$(window).on("mousemove", this.onHov);
	$(window).on("mousedown", this.onCli);
}

function distance(x1, y1, x2, y2){
	return Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
}