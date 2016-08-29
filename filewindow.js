(function() {

	var winWrapper = $('#explorer-windows');
	var activeWindows = $('.window-placeable');
	var height = $(window).innerHeight();
	var width = $(window).innerWidth();
	var lastStaticMove = {x:0, y:0};
	var generator = {x:width/2, y:height/2};
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

		var delButtImg = $('<img src="assets/ic_cancel_black_24dp/web/delete.png">');
		$(delButtImg).css({width:widthNorm})
		$(delButtImg).css('pointer-events', 'none');

		$(delButt).append(delButtImg);
		/* END DELETE BUTTON */

		/* MOVEMENT BUTTON */
		var moveButt = $('<button type="button" class="btn btn-default move-button"></button>');

		$(buttonGroup).append(moveButt);

		var moveButtImg = $('<img src="assets/ic_zoom_out_map_black_24dp/web/move.png">');
		$(moveButtImg).css({width:widthNorm})
		$(moveButtImg).css('pointer-events', 'none');

		$(moveButt).append(moveButtImg);
		/* END MOVEMENT BUTTON */

		$(winButts).append(buttonGroup);
		
		$(winWrapper).append(encaps);

		$(buttonGroup).css({position: 'absolute', top: -9999, bottom: -9999, margin: 'auto', left: 0, height: $(buttonGroup).height()});

		var standInterval = $(buttonGroup).width();
		var baseButt = $('<button type="button" class="btn-lg btn-circle btn-default">HI</button>');
		$(baseButt).css({top: -100, bottom: -100, margin: 'auto', left: standInterval * 1.25, position: 'absolute'});
		$(encaps).append(baseButt);

		$(moveButt).on('mouseup', moveReleased);
		$(moveButt).on('mousedown', moveClicked);
		$(delButt).on('mousedown', deleteWin);

		//$(encaps).children().css('pointer-events', 'all');
		update();
		generator.x+=10;
		generator.y+=10;

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