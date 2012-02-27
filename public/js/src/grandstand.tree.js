( function ( gs, $ ) {
	var tree = {
		cfg: {
			//jQuery variables
			$container: null,
			$projectTitle : null,

			//groups 
			$groups: null,
			$currentGroup : null,			
			$groupTitles : null,
			$groupTitlesArrow : null,
			$addGroup : null,
		
			//files
			$files: null,
			$currentFile : null,
			$addFile : null,
			

			//remove buttons
			$remove : null,
			$removeConfirmation : null,
			$confirmRemove : null,
			$cancelRemove : null,
			
			//non jQuery variables
			imgHeight : null,
			sortableOptions : null,
			editableOptions: null,

			templates: {}
		},
		evt : {
			'ready' : function(){
					tree.fn.init();
					tree.fn.binds();

			},
			'resize' : function(){
				
			}
		},
		fn: {
			'init' : function(){
				

				tree.cfg.templates.group = $( '#list-section' ).html();
				tree.cfg.templates.file = $( '#list-file' ).html();

				//Initializing all jquery elements.
				tree.cfg.$projectTitle = $('#projectData > h2');
				tree.cfg.$container = $('#tree');
				tree.cfg.$groups = $('.group > ul');
				tree.cfg.$groupTitles = $('.group h3');
				tree.cfg.$groupTitlesArrow = $('.arrow');
				tree.cfg.$files = $('.file');
				tree.cfg.$fileTitles = $('.file').find('.title');
				
				tree.cfg.$addGroup = $('#addGroup');
				tree.cfg.$addFile = $('.addFile');
				
				tree.cfg.$remove = $('.remove');
				tree.cfg.$removeConfirmation = $('.confirmRemove');
				tree.cfg.$confirmRemove = tree.cfg.$removeConfirmation.find('.confirm');
				tree.cfg.$cancelRemove = tree.cfg.$removeConfirmation.find('.cancel');


				//making groups and files sortable.
				tree.cfg.sortableOptions = {
					'files' : {
						placeholder: 'sortable-placeholder',
						connectWith: tree.cfg.$groups,
						dropOnEmpty: true,
						axis: 'y'
					},
					'groups' : {
						placeholder: 'sortable-placeholder',
						axis: 'y'
					}
				};
				tree.cfg.editableOptions = {
					'common' : {
						tooltip   : 'Click to edit...'
					}
				};

				tree.cfg.$container.sortable(tree.cfg.sortableOptions.groups);
				tree.cfg.$groups.sortable(tree.cfg.sortableOptions.files);
				tree.fn.initEditable();

				tree.cfg.$groupTitlesArrow
					.bind( 'click.gs', tree.fn.toggleGroup );
			},
			'binds' : function(){
				//add binds 
				tree.cfg.$addGroup
					.bind('click.gs', tree.fn.addGroup);
				tree.cfg.$addFile
					.bind( 'click.gs', tree.fn.addFile );

				//remove binds
				tree.cfg.$remove
					.bind( 'click.gs', tree.fn.remove.ask );
				tree.cfg.$confirmRemove
					.bind( 'click.gs', tree.fn.remove.confirm );
				tree.cfg.$cancelRemove
					.bind( 'click.gs', tree.fn.remove.cancel );

				
			},
			
			'initEditable' : function(){
				tree.cfg.$projectTitle
					.add(tree.cfg.$groupTitles)
					.add(tree.cfg.$fileTitles)
					.editable(
						function(value, settings) { 
							$(this).html(value);
						}, 
						tree.cfg.editableOptions.common);
			
				return false;


			},
			'updateEditable' : function(value, settings){
				console.log(value);
			},
			
			'toggleGroup' : function(){
				$(this).parent().next().slideToggle(500);
				$(this).closest('.group').first().toggleClass('open closed');

				return false;
			},
			
			// functions to manipulate groups
			'addGroup' : function () {
				//add the group!
				tree.cfg.$container.prepend( tree.fn.render( 'group', { 'id': 1 } ) );
				$thisGroup = tree.cfg.$container.children(':first-child');

				$thisGroup.find('.arrow')
					.bind( 'click.gs', tree.fn.toggleGroup);
				$thisGroup.find('.remove')
					.bind( 'click.gs', tree.fn.remove.ask);
				
				$thisGroup.find('.confirm')
					.bind( 'click.gs', tree.fn.remove.confirm );
				$thisGroup.find('.cancel')
					.bind( 'click.gs', tree.fn.remove.cancel );

				$thisGroup.find('.addFile')
					.bind( 'click.gs', tree.fn.addFile );

				tree.fn.init();
				$thisGroup.find('h3').trigger( 'click');
				return false;
			},
			'addFile' : function(){
				$thisGroup = $(this).prev(); //.parent().find('ul');
				$thisGroup.append( tree.fn.render( 'file', { 'id': 1 } ) );
				$newFile = $thisGroup.children(':last-child');
				$newFile.hide().slideDown();
				$thisGroup.sortable('refresh');
				$newFile.find('.remove')
					.bind( 'click.gs', tree.fn.remove.ask);
				$newFile.find('.confirm')
					.bind( 'click.gs', tree.fn.remove.confirm);
				$newFile.find('.cancel')
					.bind( 'click.gs', tree.fn.remove.cancel);
				tree.fn.init();


				return false;
			},
			'remove' : {
				'ask' : function () {
	
					tree.fn.resetButtons();
					//show confirmation buttons
					$removeBtn = $(this);
					$removeBtn.hide();
					$removeBtn.next().show('slide', {direction : 'right'}, 500);
					return false;
				},
				'cancel' : function () {
					tree.fn.resetButtons();
					return false;
				},
				'confirm' : function () {
					
					if ( $(this).hasClass('removeGroup') ) {
						tree.cfg.$currentItem = $(this).closest('.group').first();
					}
					else if ( $(this).hasClass('removeFile') ) {
						tree.cfg.$currentItem = $(this).closest('.file').first();
					}
					else {
						return false;
					}

					tree.cfg.$currentItem.slideUp().queue(function(){
						$(this).remove();
					});
					return false;		
				}
			},
			'resetButtons' : function(){
				//reset all buttons.
				tree.cfg.$remove.show();
				tree.cfg.$removeConfirmation.hide();

				return false;
			},

			'render': function( tplName, view ) {
				return Mustache.render( tree.cfg.templates[tplName], view );
			}
		}
	};

	gs.modules.tree = tree;

}( GS, jQuery ) );