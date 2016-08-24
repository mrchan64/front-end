(function() {


    var image = document.getElementById('image-background');

    var imagestart = {left: window.getComputedStyle(image).getPropertyValue('left') , top: window.getComputedStyle(image).getPropertyValue('top')};
    // Main
    resize();

    var width = image.width;
    var height = image.height;
    addListeners();

    function resize() {
        var minheight = window.innerheight*1.2;
        var minwidth = window.innerwidth*1.2;
        var windowscale = minheight/minwidth;
        var imagescale = image.naturalHeight/image.naturalWidth;
        if(windowscale>image.scale){    //window height is bigger, align factor
            image.height = minheight;
            image.width = 'auto';
        }else{
            image.width = minwidth;
            image.height = 'auto';
        }
    }

    // Event handling
    function addListeners() {
        if(!('ontouchstart' in window)) {
            window.addEventListener('mousemove', mouseMove);
        }
        window.addEventListener('resize', resize);
    }

    function mouseMove(e) {
        var posx = posy = 0;
        if (e.pageX || e.pageY) {
            posx = e.pageX;
            posy = e.pageY;
        }
        else if (e.clientX || e.clientY) {
            posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        image.style.left = parseInt(imagestart.left, 10)-(width/2-posx)/100 +'px';
        image.style.top = parseInt(imagestart.top, 10)-(height/2-posy)/100 + 'px';
        }

})();