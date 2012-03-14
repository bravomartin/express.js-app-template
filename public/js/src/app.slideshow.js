( function ( app, $ ) {
	var slideshow = {
		cfg: {
			//jQuery variables
			$container: null,
			$projectTitle : null
		},
		evt : {
			'ready' : function(){
					slideshow.fn.init();
					slideshow.fn.binds();

			},
			'resize' : function(){
				
			}
		},
		fn: {
			'init' : function(){
				

				
				slideshow.cfg.$main = $('#maincolumn');
				


				
			},
			'binds' : function(){
				//add binds 
				slideshow.cfg.$main
					.bind('click.app', slideshow.fn.changeColor);
				

				

				
			},
			'changeColor' : function(){
				//change color

			}
			
			
			
			
			
			

		}
	};

	app.modules.slideshow = slideshow;

}( APP, jQuery ) );