(function() {

    var width, height, image = document.getElementById('image-background');
    var imagestart = {left: window.getComputedStyle(image).getPropertyValue('left') , top: window.getComputedStyle(image).getPropertyValue('top')};
    // Main
    resize();
    addListeners();

    // Event handling
    function addListeners() {
        if(!('ontouchstart' in window)) {
            window.addEventListener('mousemove', mouseMove);
        }
        window.addEventListener('resize', resize);
    }

    function mouseMove(e) {
        //console.log('mouse is moving');
        //console.log(image.style.left,image.style.top,image.style.right,image.style.bottom);
        console.log();
        var posx = posy = 0;
        if (e.pageX || e.pageY) {
            posx = e.pageX;
            posy = e.pageY;
        }
        else if (e.clientX || e.clientY) {
            posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        image.style.left = parseInt(imagestart.left, 10)+(width/2-posx)/30 +'px';
        image.style.top = parseInt(imagestart.top, 10)+(height/2-posy)/30 + 'px';
        }

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
    }

})();