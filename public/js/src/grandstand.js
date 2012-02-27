 /* 	
GRANDSTAND
The Barbarian Group
*/

var GS = ( function (gs, $) {

	gs.modules = gs.modules || {};
	
	// global setting variables go here
	gs.settings = {
			initialized: false
		};
	
	gs.evt = {
			'ready': function( evt ) {
				if ( 'app' in gs ) {
					gs.app.run();
				}
			}	
	};
	gs.fn = {
		'init': function(){
			if ( gs.settings.initialized ) return false;
			// bindings
			$( window )
				.unbind( 'keydown.gs keypress.gs keyup.gs' ) //unbinding for safety.
				.bind( 'keydown.gs keypress.gs keyup.gs', function( e ) {
					
					return gs.fn.trigger( e.type, e );
				} );
			// if we've got the throttle plugin, use it
			if ( 'throttle' in $ ) {
				$( window )
					.unbind( 'resize.gs' )
					.bind( 'resize.gs', $.throttle( 100, function( e ) {
						return gs.fn.trigger( e.type, e );
					} ) )
					.trigger( 'resize.gs' );
			} else {
				$( window )
					.unbind( 'resize.gs' )
					.bind( 'resize.gs', function( e ) {
						gs.fn.set('windowWidth', $( window ).width( ) );
						gs.fn.set('windowHeight', $( window ).height( ) );
						
						return gs.fn.trigger( e.type, e );
					} )
					.trigger( 'resize.gs' );
			}
			$( document )
				.unbind( 'ready.gs' )
				.bind( 'ready.gs', function( e ) {
					return gs.fn.trigger( e.type, e );
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
			gs.fn.set( 'base_url', baseSrc );
			// load modules

			gs.settings.initialized = true;

		},
		'trigger': function( eventName, eventObj, args ) {
			// Add some assurances to our eventObj
			if( typeof eventObj == "undefined" )
				eventObj = { 'type': 'custom' };

			// trigger the global handlers first
			if ( eventName in gs.evt ) {
				// if it returns false, stop the train
				if ( gs.evt[eventName]( eventObj ) === false ) {
					return false;
				}
			}
			// run the event handler on each module that's got it
			for( var module in gs.modules ) {
				if( module in gs.modules && 'evt' in gs.modules[module] && eventName in gs.modules[module].evt ) {
					gs.modules[module].evt[eventName]( eventObj, args );
				}
			}
		},
		// Adds a variable to the GS global settings
		'set': function( key, value ) {
			gs.settings[key] = value;
			return value;
		},
		// returns a variable from the GS global settings
		// defaults to the key if the variable can't be found
		'get': function( key ) {
			if( key in gs.settings ) {
				return gs.settings[key];
			} else {
				return key;
			}
		}
		
		
	};
	
	
	gs.fn.init();
	
	
	return gs;
}(GS || {}, jQuery));





