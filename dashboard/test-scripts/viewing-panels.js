var panels = 5;
var margin = 10;
var ymultiplier = 5;

var width = $(window).width();

var dashboard = $("#stackable");
var panelManager = new PanelManager(dashboard);

function Panel(obj, height, posy) {
	this.element = obj;
	this.width = width/80;
	this.height = height;
	this.x = width;
	this.y = posy
	this.element.css({height: this.height, top: this.y, width: this.width});
	var radius = height/10;
	this.element.css("border-top-left-radius", radius);
	this.element.css("border-bottom-left-radius", radius);
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
		this.panels.unshift(panel);
		this.element.append(panel.element);
		posYindex += height;
	}

	this.onHover = function(event){
		for(i = 0; i<e.panels.length; i++){
			if()
		}
	}
}