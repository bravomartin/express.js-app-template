var APP = ( function (app, $) {

	app.modules = app.modules || {};
	
	// global setting variables go here
	app.settings = {
			initialized: false
		};
	
	app.evt = {
			'ready': function( evt ) {
				if ( 'app' in app ) {
					app.app.run();
				}
			}
	};
	app.fn = {
		'init': function(){
			if ( app.settings.initialized ) return false;
			// bindings
			$( window )
				.unbind( 'keydown.app keypress.app keyup.app' ) //unbinding for safety.
				.bind( 'keydown.app keypress.app keyup.app', function( e ) {
					
					return app.fn.trigger( e.type, e );
				} );
			// if we've got the throttle plugin, use it
			if ( 'throttle' in $ ) {
				$( window )
					.unbind( 'resize.app' )
					.bind( 'resize.app', $.throttle( 100, function( e ) {
						return app.fn.trigger( e.type, e );
					} ) )
					.trigger( 'resize.app' );
			} else {
				$( window )
					.unbind( 'resize.app' )
					.bind( 'resize.app', function( e ) {
						app.fn.set('windowWidth', $( window ).width( ) );
						app.fn.set('windowHeight', $( window ).height( ) );
						
						return app.fn.trigger( e.type, e );
					} )
					.trigger( 'resize.app' );
			}
			$( document )
				.unbind( 'ready.app' )
				.bind( 'ready.app', function( e ) {
					return app.fn.trigger( e.type, e );
				} );
				
			// attempt to set our base url based on where this script lives
			// assumes this script is being packaged into a script that lives in {base_url}/js/{package_name}.js
			var baseSrc = "/"; // default to nada
			$( 'script[src^="/"]' ).each( function() {
				$script = $( this );
				if( $script.attr( 'src' ).match( /^\/{1}[a-zA-Z0-9]+/ ) &&
					$script.attr( 'src' ).match( /^.*?(?=js\/[a-zA-Z0-9\_\-]+\.js)/ ) ) {
					baseSrc = $script.attr( 'src' ).match( /^.*?(?=js\/[a-zA-Z0-9\_\-]+\.js)/ )[0];
				}
			} );
			app.fn.set( 'base_url', baseSrc );
			// load modules

			app.settings.initialized = true;

		},
		'trigger': function( eventName, eventObj, args ) {
			// Add some assurances to our eventObj
			if( typeof eventObj == "undefined" )
				eventObj = { 'type': 'custom' };

			// trigger the global handlers first
			if ( eventName in app.evt ) {
				// if it returns false, stop the train
				if ( app.evt[eventName]( eventObj ) === false ) {
					return false;
				}
			}
			// run the event handler on each module that's got it
			for( var module in app.modules ) {
				if( module in app.modules && 'evt' in app.modules[module] && eventName in app.modules[module].evt ) {
					app.modules[module].evt[eventName]( eventObj, args );
				}
			}
		},
		// Adds a variable to the APP global settings
		'set': function( key, value ) {
			app.settings[key] = value;
			return value;
		},
		// returns a variable from the APP global settings
		// defaults to the key if the variable can't be found
		'get': function( key ) {
			if( key in app.settings ) {
				return app.settings[key];
			} else {
				return key;
			}
		}
		
		
	};
	
	
	app.fn.init();
	
	
	return app;
}(APP || {}, jQuery));





