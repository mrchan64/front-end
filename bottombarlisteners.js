(function() {

    var menuItems = document.getElementsByClassName("bottom-bar-element");

    resize();
    window.addEventListener('resize', resize);

    for(var i = 0; i < menuItems.length; i++){  //icons

        //menuItems[i][0].;
    }

    for(var i = 0; i < menuItems.length; i++){  //hoverbars
        menuItems[i][1].addEventListener('scroll', scrollDelegate, false);
        menuItems[i][1].addEventListener('mouseover', hoverDelegate, false);
    }

    function scrollDelegate(e){

    }

    function hoverDelegate(e){

    }

    function resize(){
        for(var i = 0; i < menuItems.length; i++){  //icons
            var width = menuItems[i].innerWidth;
            var height = menuItems[i].innerHeight;
            menuItems[i][0].style.width = width*.5+'px';
            menuItems[i][0].style.height = width*.5+'px';
            menuItems[i][0].style.left = width*.25+'px';
            menuItems[i][0].style.top = width*.25+'px';
        }
    }

})();