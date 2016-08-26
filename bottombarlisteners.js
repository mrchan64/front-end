(function() {

    var menuItems = $('.bottom-bar-element');
    console.log(menuItems);
    resize();
    initstuff();
    window.addEventListener('resize', resize);

    function initstuff(){
        menuItems.each(function(){
            var circbox = $(this).find('.expanding-circle-box')[0]
            var tab = $(this).children()[0]
            console.log($(tab))
            $(tab).on('mouseenter', function(){
                $(circbox).stop()
                var high = $(circbox).data("high");
                $(circbox).animate({top: high}, 200);
            });
            $(tab).on('mouseleave', function(){
                $(circbox).stop()
                var low = $(circbox).data("low");
                $(circbox).animate({top: low}, 200);
            });/*
            $(circ).on('mouseenter', function(){
                $
                $(circ).animate({top: high}, 200);
            });
            $(circ).on('mouseleave', function(){
                console.log(2);
                $(circ).stop()
                var low = $(circ).data("low");
                $(circ).animate({top: low}, 200);
            });*/
        });
    }

    var scrollDelegate = function(e){

    }

    function resize(){
        menuItems.each(function(){
            var width = $(this).innerWidth();
            var height = $(this).innerHeight();
            $(this).find('.expanding-circle-box').each(function(){
                $(this).width(width/2).height(width/2);
                $(this).css({top: -width/8, left: width/4, position: 'absolute'})
            });
            var circbox = $(this).find('.expanding-circle-box')[0]
            var circ = $(this).find('.expanding-circle')[0]
            $(circ).css({width: '100%', height: '100%'});
            var tab = $(this).children()[0];
            var extra = $(circbox).height();
            var current = $(circbox).position().top;
            var height = $(tab).height();
            $(circbox).data('high', current-(height*10+extra));
            $(circbox).data('low', current);
            var wind = $(window);
            var maxheight = $(wind).innerHeight() * .75;
            $(tab).data('max', maxheight);
        });
    }

})();