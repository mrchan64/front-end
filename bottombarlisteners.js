(function() {

    var menuItems = $('.bottom-bar-element');
    console.log(menuItems);
    resize();
    initstuff();
    window.addEventListener('resize', resize);

    function initstuff(){
        menuItems.each(function(){
            var circ = $(this).find('.expanding-circle')[0]
            var tab = $(this).children()[0]
            var extra = $(circ).height();
            var current = $(circ).position().top
            var height = $(tab).height();
            $(tab).on('mouseover', circleOnDelegate(tab,circ,current,height,extra));
        });
    }

    function scrollDelegate(e){

    }

    function circleOnDelegate(tab, circ, current,height,extra){
        console.log(1);
        $(tab).off('mouseover');
        $(circ).animate({top: current-(height*10+extra)}, '.2s');
    }

    function resize(){
        menuItems.each(function(){
            var width = $(this).innerWidth();
            var height = $(this).innerHeight();
            $(this).find('.expanding-circle').each(function(){
                $(this).width(width/2).height(width/2);
                $(this).css({top: -width/8, left: width/4, position: 'absolute'})
            });
        });
    }

})();