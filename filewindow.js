(function() {

	var winWrapper = $('#explorer-windows');
	var activeWindows = $('.window-placeable');
	var height = $(window).innerHeight();
	var width = $(window).innerWidth();
	var lastStaticMove = {x:0, y:0};
	var generator = {x:10, y:10};
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
		var encapsBox = $(this).parent().parent().parent().parent().parent();
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
		var encapsBox = $(this).parent().parent().parent().parent().parent();
		$(encapsBox).data('moving',false);
	}

	function newWinHTML(){
		var encaps = $('<div class="window-placeable"></div>');
		$(encaps).css({height: height*.4, width: height*.6, top: generator.y, left: generator.x, position: 'absolute'});

		var row = $('<div class="row"></div>');
		$(encaps).append(row);

		var screenPanel = $('<div class="col-sm-11 col-xs-11 "></div>');
		var buttGrid = $('<div class="col-sm-1 col-xs-1 "></div>');
		$(row).append(screenPanel);
		$(row).append(buttGrid);

		var buttGridRow = $('<div class="row"></div>');
		$(buttGrid).append(buttGridRow);

		var buttGridInner = [
			$('<div class="col-sm-12 col-xs-12 button-distr-window"></div>'), 
			$('<div class="col-sm-12 col-xs-12 button-distr-window"></div>'), 
			$('<div class="col-sm-12 col-xs-12 button-distr-window"></div>'), 
			$('<div class="col-sm-12 col-xs-12 button-distr-window"></div>'), 
			$('<div class="col-sm-12 col-xs-12 button-distr-window"></div>'), 
			$('<div class="col-sm-12 col-xs-12 button-distr-window"></div>'), 
			$('<div class="col-sm-12 col-xs-12 button-distr-window"></div>'), 
			$('<div class="col-sm-12 col-xs-12 button-distr-window"></div>'), 
			$('<div class="col-sm-12 col-xs-12 button-distr-window"></div>'), 
			$('<div class="col-sm-12 col-xs-12 button-distr-window"></div>'),
			$('<div class="col-sm-12 col-xs-12 button-distr-window"></div>'), 
			$('<div class="col-sm-12 col-xs-12 button-distr-window"></div>'), 
			$('<div class="col-sm-12 col-xs-12 button-distr-window"></div>'), 
			$('<div class="col-sm-12 col-xs-12 button-distr-window"></div>'), 
			$('<div class="col-sm-12 col-xs-12 button-distr-window"></div>'), 
			$('<div class="col-sm-12 col-xs-12 button-distr-window"></div>'), 
			$('<div class="col-sm-12 col-xs-12 button-distr-window"></div>'), 
			$('<div class="col-sm-12 col-xs-12 button-distr-window"></div>'), 
			$('<div class="col-sm-12 col-xs-12 button-distr-window"></div>'), 
			$('<div class="col-sm-12 col-xs-12 button-distr-window"></div>')
		]
		for(var i = 0; i < buttGridInner.length; i++){
			$(buttGridRow).append(buttGridInner[i]);
			var fromTop = i*(100/buttGridInner.length)+'%';
			var interval = (100/buttGridInner.length)+'%'
			$(buttGridInner[i]).css({position: 'absolute', top: fromTop, height: interval});
		}

		$(winWrapper).append(encaps);

		var moveButt = $('<img src="assets/ic_zoom_out_map_black_24dp/web/ic_zoom_out_map_black_24dp_2x.png" class="move-button">');
		var autoHeight = $(buttGridInner[0]).height()*.9;
		$(moveButt).css({height: autoHeight, width: autoHeight, position: 'absolute', top: -9999, right: -9999, bottom: -9999, left: -9999, margin: 'auto'});
		$(buttGridInner[10]).append(moveButt);

		$(moveButt).on('mouseup', moveReleased);
		$(moveButt).on('mousedown', moveClicked);
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
    }


})();