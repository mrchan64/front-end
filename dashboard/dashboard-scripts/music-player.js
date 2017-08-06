(function() {

	var tab = $("#music-player");
	var lastState = "closed";
	var element = $("<div></div>");
	initElement();

	$(window).on("mousedown", updateState);

	function updateState(){
		var state = tab.data('state');
		if(state != lastState){
			lastState = state;
			if(state == "open"){
				tab.append(element);
			}else{
				element.detach();
			}
		}
	}

	function initElement(){
		element.addClass("example-music");
		var height = tab.height()*tab.data('obj').ymultiplier;
		var width = tab.width()*tab.data('obj').clickmultiplier;
		element.css({width:width, height:height});

		var timeBar = $("<div></div>");
		var tHeight = 1;
		var tWidth = width * .8;
		var ty = height * .5;
		var tx = width *.1;
		timeBar.css({top:ty, left: tx, height: tHeight, width: tWidth, position: 'absolute'})
		timeBar.css("background-color", "#FFF");
		element.append(timeBar);

		var timePointer = $("<div></div>");
		timePointer.type = 'button';
		timePointer.addClass("time-pointer");
		var xbase = -4;
		timePointer.hover(function(){
			xbase = -5;
			timePointer.css("left",xbase);
		}, function(){
			xbase = -4
			timePointer.css("left",xbase);
		});
		setInterval(function(){
			timePointer.css("left",xbase);
		},100);
		timeBar.append(timePointer);
	}

})();