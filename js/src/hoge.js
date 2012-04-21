$(window).bind('space_geosocial_ready', function(){
	console.log(window.space_geosocial);
	console.log('yesssssss!!!');
	var s = window.space_geosocial;
	s.reset_params(function(){
		s.get_near_stars(function(stars){
			var $body = $('body');
			$body.append('<p>len : ' + stars.length + '</p>');
			for(var i = 0; i < stars.length; i++){
				$body.append('<p>id : ' + stars[i].id + ', name: ' + stars[i].name + '</p>');
			}
		}, 10, 30, 10);
		//}, alpha = 0, gamma = 0, margin = 30);
	});
});
