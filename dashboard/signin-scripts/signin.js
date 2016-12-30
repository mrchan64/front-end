(function(){

	var cookies = document.cookie.split(';')
	var client_id = null;
	for(i = 0; i<cookies.length; i++){
		if(cookies[i].substring(0,9)=="client_id"){
			client_id = cookies[i].substring(10,cookies[i].length);
			break;
		}
	}

	var apiIp = "";
	$.get("/api", function(data, status){
		apiIp = data["ip"];
	});

	$('#main-form').on('submit', function(event){
		event.preventDefault();
		var data = {
			"username": $('#inputUsername').val(),
			"password": $('#inputPassword').val(),
			"client_id": client_id
		}
		$.post(apiIp+'/login', data, function(data, status, request){
			if(data.status){
				window.location.href = "/dashboard";
			}else{
				displayInvalid();
			}
		});
	});

	function displayInvalid(){
		var header = $("#header");
		$(header).text("Invalid login");
		$(header).css("opacity", 0);
		$(header).animate({opacity: 1}, 500)
	}

})();