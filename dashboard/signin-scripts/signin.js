(function(){

	var apiIp = "";
	$.get("/api", function(data, status){
		apiIp = data["ip"];
	});

	$('#main-form').on('submit', function(event){
		event.preventDefault();
		var data = {
			"username": $('#inputUsername').val(),
			"password": $('#inputPassword').val()
		}
		$.post(apiIp+'/login', data, function(data, status){
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