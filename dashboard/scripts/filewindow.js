(function() {

	var winWrapper = $('#explorer-windows');
	var activeWindows = $('.window-placeable');
	var height = $(window).innerHeight();
	var width = $(window).innerWidth();
	var lastStaticMove = {x:0, y:0};
	var generator = {x:width/2, y:height/2};
	var apiIp = "";
	$.get("/api", function(data, status){
		apiIp = data["ip"];
	});
	initialize();
	resize();
    window.addEventListener('mousemove', mouseMove);
	//newWinHTML()

    window.addEventListener('resize', resize);

    function initialize(){
    	$('.control-button-image').each(function(){
    		var norm = $(this).parent().height() * .5
    		$(this).css({width: norm});
    	});
    	$('#new-window-button').on('click', newWinHTML);
    	$('#reset-windows-button').on('click', resetAll);
    	$('#lock-windows-button').on('click', lockWindows);
    }

	function mouseMove(event){
		$(activeWindows).each(function(){
			if($(this).data('moving')==true){
				var dx = event.screenX - lastStaticMove.x;
				var dy = event.screenY - lastStaticMove.y;
				var absx = $(this).data('lastleft') + dx;
				var absy = $(this).data('lasttop') + dy;
				$(this).css({top: absy, left: absx});
			}
		});
	}

	function moveClicked(event) {
		var encapsBox = $(this).parent().parent().parent();
		$(encapsBox).data('moving',true);
		var pos = $(encapsBox).position()
		if(!$(encapsBox).hasClass('window-placeable')){
 			return;
 		}
		var top = pos.top;
		var left = pos.left;
		$(encapsBox).data("lasttop",top);
		$(encapsBox).data("lastleft",left);
		lastStaticMove.x = event.screenX;
		lastStaticMove.y = event.screenY;
	}

	function moveReleased(event) {
		var encapsBox = $(this).parent().parent().parent();
		if(!$(encapsBox).hasClass('window-placeable')){
 			return;
 		}
		$(encapsBox).data('moving',false);
	}

	function deleteWin(event){
		var encapsBox = $(this).parent().parent().parent();
		if(!$(encapsBox).hasClass('window-placeable')){
 			return;
 		}
 		$(encapsBox).remove();
	}

	function newWinHTML(){
		var encaps = $('<div class="window-placeable"></div>');
		$(encaps).css({top: generator.y, left: generator.x, position: 'absolute'});

		var winButts = $('<div></div>');
		$(winButts).css({height: '100%', width: 2, left: 0, position: 'absolute'});
		$(encaps).append(winButts);

		var buttonGroup = $('<div class="btn-group-vertical"></div>');

		var widthNorm = $(this).parent().width()*.4;

		/* DELETE BUTTON */
		var delButt = $('<button type="button" class="btn btn-default del-button"></button>');

		$(buttonGroup).append(delButt);

		var delButtImg = $('<img src="delete.png">');
		$(delButtImg).css({width:widthNorm})
		$(delButtImg).css('pointer-events', 'none');

		$(delButt).append(delButtImg);
		/* END DELETE BUTTON */

		/* MOVEMENT BUTTON */
		var moveButt = $('<button type="button" class="btn btn-default move-button"></button>');

		$(buttonGroup).append(moveButt);

		var moveButtImg = $('<img src="move.png">');
		$(moveButtImg).css({width:widthNorm})
		$(moveButtImg).css('pointer-events', 'none');

		$(moveButt).append(moveButtImg);
		/* END MOVEMENT BUTTON */

		$(winButts).append(buttonGroup);
		
		$(winWrapper).append(encaps);

		$(buttonGroup).css({position: 'absolute', top: -9999, bottom: -9999, margin: 'auto', left: 0, height: $(buttonGroup).height()});

		var standInterval = $(buttonGroup).width();
		var baseButt = $('<button type="button" class="btn btn-lg btn-circle btn-default"></button>');

		var pass = {directory: ""};
		$.post(apiIp+'/children', pass, function(data, status){
			$(baseButt).data("children", data["children"]);
		}, "json");

		var baseButtImg = $('<img src="folder-light-gray.png">');
		$(baseButtImg).css({height: '100%'});
		$(baseButtImg).css('pointer-events', 'none');
		$(baseButt).append(baseButtImg);

		$(baseButt).css({top: -100, bottom: -100, margin: 'auto', left: standInterval * 1.25, position: 'absolute'});
		$(encaps).append(baseButt);
		$(baseButt).data("directory", "");
		$(baseButt).data("standInterval", standInterval);
		$(baseButt).data("open", false);

		$(moveButt).on('mouseup', moveReleased);
		$(moveButt).on('mousedown', moveClicked);
		$(delButt).on('click', deleteWin);
		$(baseButt).on('click', createChild)

		//$(encaps).children().css('pointer-events', 'all');
		update();
		generator.x+=10;
		generator.y+=10;

	}

	function createChild(){
		var parent = $(this).parent();

		if($(this).hasClass('btn-file')){
			parent = $(this).parent().parent();
		}

		if($(this).data("open")){
			var tbDeleted = $(this).data("childScreen");
			$(tbDeleted).remove();
			$(this).data("childScreen", null);
			$(this).data("open", false);
		} else {
			if($(parent).data("active")!=null){
				createChild.call($(parent).data("active"));
			}

			var fileDir = $(this).data("directory");

			var standInterval = $(this).data("standInterval");

			//code for retrieving child files
			var children = $(this).data("children");

			var display = $('<div class="folder-window"></div>');
			var caret = $('<div class="file-triangle"></div>');
			$(display).append(caret);
			$(caret).css({top: -9999, bottom: -9999, position: 'absolute'})
			$(caret).css("margin-top", "auto");
			$(caret).css("margin-bottom", "auto");
			$(caret).css("margin-left", 0);
			$(caret).css("margin-right", 0);
			var buttonScroll = $('<div></div');
			$(display).append(buttonScroll);
			var line = $('<div></div>');
			$(line).css({height: '100%', width: 2, float: "left"});
			$(line).css('background-color', '#eee');
			$(buttonScroll).append(line);
			var divHeight = (32)*children.length-2;
			var divWidth = 150+12.99+2+3;
			var offsetLeft = standInterval * 2.35;
			var tempoffs = divHeight;
			var ditMarg = 0;
			if(divHeight > 300){
				tempoffs = 300;
				$(line).css('margin-top', 30);
				ditMarg = 30;
				$(buttonScroll).css("-webkit-mask-image", "linear-gradient(transparent 0%, black 10%, black 90%, transparent 100%)");
			}

			//sort children please

			var counter = 0;
			$(children).each(function(){
				//children{}:
				//type: "file" "folder" "new"
				//name: "<>"
				var htmlStr = '<button type="button" class="btn btn-file btn-default-2"></button>';
				var htmlObj = $(htmlStr);
				$(htmlObj).data("directory", fileDir+'/'+this["name"]);
				$(htmlObj).data("standInterval", standInterval);
				$(buttonScroll).append(htmlObj);
				$(htmlObj).css({margin: 1, float: 'right'});
				if(counter == 0){
					$(htmlObj).css("margin-top", ditMarg);
				}
				if(counter == children.length-1){
					$(htmlObj).css("margin-bottom", ditMarg);
				}
				counter++;

				var icon = $('<img src="file-dark-gray.png">');
				var text = $('<div class="window-text">'+this["name"]+'</div>');

				switch(this["type"]){
					case "folder":
						icon = $('<img src="folder-dark-gray.png">');
						var pass = {"directory": $(htmlObj).data("directory")};
						$.post(apiIp+'/children', pass, function(data, status){
							$(htmlObj).data("children", data["children"]);
						}, "json");
						htmlObj.on('click', createChild);
						break;
					case "new":
						icon = $('<img src="new-folder-dark-gray.png">');
						break;
				}

				$(icon).css({height: '100%', float: 'left'});
				$(icon).css('pointer-events', 'none');
				//need to add fade if text goes beyond end, and div smaller when hovered for trash buttons

				$(htmlObj).append(icon);
				$(htmlObj).append(text);
			});
			$(parent).append(display);
			var offsetTop = -tempoffs/2;
			if($(this).hasClass('btn-file')){
				offsetLeft = standInterval * 3.45;
				var approx = $(this).parent().parent().offset().top - $(this).offset().top;
				offsetTop = -tempoffs/2-approx+15;
			}

			$(line).css({height: divHeight});
			$(display).css({height: tempoffs, width: divWidth, top: offsetTop, left: offsetLeft, position: 'absolute'});
			$(buttonScroll).css({height: tempoffs, width: divWidth-12, float: 'right', overflow: 'scroll'});

			$(this).data("childScreen", display);
			$(this).data("open", true);
		}

		if($(this).hasClass('btn-default-2')){
			$(this).removeClass('btn-default-2');
			$(this).addClass('btn-default-2a');
			$(parent).data("active", $(this));
		}else{
			if($(this).hasClass('btn-default-2a')){
				$(this).removeClass('btn-default-2a');
				$(this).addClass('btn-default-2');
				$(parent).data("active", null);
			}
		}
	}

	function resetAll(){
		$(winWrapper).empty();
	}

	function lockWindows(){
		//add code
	}

	function update() {
		activeWindows = $('.window-placeable');
	}

    function resize(){
        var control = $('#control-buttons');
        var controlLeft = height * .01;
        var controlMid = (height - control.height()) / 2;
        control.css({top: controlMid, left: controlLeft})
        //var 
    }


})();