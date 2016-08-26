(function() {

	var winWrapper = $('#explorer-windows');
	var activeWindows = $('.window-placeable');
	var height = $(window).innerHeight();
	var width = $(window).innerWidth();
	var lastStaticMove = {x:0, y:0};
	if(!('ontouchstart' in window)) {
        window.addEventListener('mousemove', mouseMove);
    }
	newWinHTML()

    window.addEventListener('resize', resize);

	var newWindow = function(){

	}

	function mouseMove(event){
		console.log('movement');
		$(activeWindows).each(function(){
			if($(this).data('moving')){
				var dx = event.screenX - lastStaticMove.x;
				var dy = event.screenY - lastStaticMove.y;
				var absx = $(this).data('lastleft') + dx;
				var absy = $(this).data('lasttop') + dy;
				$(this).css({top: absy, left: absx});
			}
		});
	}

	function moveClicked(event) {
		console.log('clicked');
		/*var encapsBox = $(this).parent();
		$(encapsBox).data('moving',true);
		var top = $(encapsBox).attr("top");
		var left = $(encapsBox).attr("left");
		$(encapsBox).data("lasttop",top);
		$(encapsBox).data("lastleft",left);
		lastStaticMove.x = event.screenX;
		lastStaticMove.y = event.screenY;*/
	}

	function moveReleased(event) {
		var encapsBox = $(this).parent();
		$(encapsBox).data('moving',false);
	}

	function newWinHTML(){
		var encaps = $(document.body).find(".window-placeable")[0];
		$(encaps).css({height: height*.4, width: height*.6, position: 'absolute'});
		var moveButt = $(document.body).find(".move-button")[0];
		$(moveButt).css({height: 40, width: 40, position: 'absolute', top: 9999, right: 0, bottom: 9999, margin: 'auto'});
		console.log($(moveButt));
		/*var encaps = $('<div class="window-placeable"></div>')
		$(encaps).css({height: height*.4, width: height*.6, position: 'absolute'});

		var moveButt = $('<img src="assets/ic_zoom_out_map_black_24dp/web/ic_zoom_out_map_black_24dp_2x.png" class="move-button">');
		$(moveButt).css({height: 40, width: 40, position: 'absolute', top: 9999, right: 0, bottom: 9999, margin: 'auto'});
		$(encaps).append(moveButt);

		$(winWrapper).append(encaps);

		console.log($('.move-button'));
		var sigh = $('.move-button')[0];
		console.log(sigh);
		$(moveButt).on('mouseleave', moveReleased);
		console.log($(moveButt))*/
		update();

	}

	function update() {
		activeWindows = $('.window-placeable');
		$(activeWindows).each(function(){
			if($(this).data("set")!=true){
				var move = $(this).find('.move-button')[0]
				console.log($(move));
				$(move).on('mousedown', moveClicked);
				$(move).on('mouseleave', moveReleased);
				$(document).on('mousedown', moveClicked);
				$('#hi').on('mousedown', moveClicked);
				$('#stop').on('mousedown', moveClicked);
				$(this).data("set", true);
				console.log('set');
			}
		})
	}

    function resize(){

    }

})();