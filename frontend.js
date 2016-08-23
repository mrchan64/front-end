(function() {

    var width, height, image = document.getElementById('image-background');
    var imagestart = {left: image.style.left, top: image.style.top, right: image.style.right, bottom: image.style.bottom};

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
        console.log('mouse is moving');
        console.log(image.style.left,image.style.top,image.style.right,image.style.bottom);
        var posx = posy = 0;
        if (e.pageX || e.pageY) {
            posx = e.pageX;
            posy = e.pageY;
        }
        else if (e.clientX || e.clientY)    {
            posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        image.style.left = parseInt(imagestart.left, 10)+(width/2-posx) +'px';
        image.style.top = parseInt(imagestart.top, 10)+(height/2-posy) + 'px';
        image.style.right = parseInt(imagestart.right, 10)+(width/2-posx) + 'px';
        image.style.bottom = parseInt(imagestart.bottom, 10)+(height/2-posy) + 'px';
        }

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
    }

})();