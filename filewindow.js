(function() {

	var winWrapper = $('#explorer-windows');
	var activeWindows = $('.window-placeable');
	var height = $(window).innerHeight();
	var width = $(window).innerWidth();
	newWinHTML()

    window.addEventListener('resize', resize);

	var newWindow = function(){

	}

	function newWinHTML(){
		var encaps = $('<div class="window-placeable" id="hi"></div>')
		$(encaps).css({height: height*.4, width: height*.6, position: 'absolute'});

		var moveButt = $('<img src = "assets/ic_zoom_out_map_black_24dp/web/ic_zoom_out_map_black_24dp_2x.png" draggable="true">');
		$(moveButt).css({height: 20, width: 20, position: 'absolute', top: 9999, right: 0, bottom: 9999, margin: 'auto'});
		$(moveButt).draggable();
		$(encaps).append(moveButt);

		$(winWrapper).append(encaps);
	}

	function update() {
		activeWindows = $('.window-placeable');
	}

    function resize(){

    }

})();