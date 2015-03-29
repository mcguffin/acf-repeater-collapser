(function($){
	if( typeof(Storage) === "undefined" ) {
		window.localStorage = window.sessionStorage = {
			readonly:true,
			key:function(){},
			setItem:function(){},
			getItem:function(){},
			removeItem:function(){}
		}
	}
	var collapseHtml = '<td class="collapser"><a href="#" class="collapse dashicons dashicons-arrow-down"></a><a href="#" class="collapse dashicons dashicons-arrow-right"></a></td>';
	// 
	
	$(document).ready(function() {
		$('.acf-repeater > table.acf-table > tbody').each(function(){
			var $rows = $(this).children('tr.acf-row'),
				field_id = $rows.closest('.acf-field-repeater').data('key');
			$rows.each( function (i,el) {
				$(collapseHtml).insertBefore( $(this).children('td.order:first') );
				
				// restore collapsed state
				if ( !$(this).hasClass('acf-clone')) {
					collapsed = true;
					try {
						collapsed = parseInt(localStorage[ field_id+'-'+acf.o.post_id+'-'+i ]);
					} catch(err) {}
					if ( !!collapsed )
						collapseRow($(this));
				}
			} );
		} );
	}).on('click','.acf-repeater a.collapse',function(e){
		// set state
		var $row = $(this).closest( '.acf-row' ), 
			collapsed = $row.hasClass('collapsed'),
			field_id = $row.closest('.acf-field-repeater').data('key'),
			i = $row.parent().children('.acf-row').index($row);
			
		if ( ! collapsed )
			collapseRow( $row );
		else 
			$row.removeClass( 'collapsed' );
		
		// store state
		window.localStorage[field_id+'-'+acf.o.post_id+'-'+i] = $row.hasClass('collapsed') ? 1 : 0;
		e.preventDefault();
		return false;
	});
	
	function collapseRow( $row ) {
		// setup placeholder
		var $fields_td = $row.children('td.acf-fields'),
			title = '';
		$fields_td.children('.collapse-row-title').each(function(){
			var label = $(this).find('.acf-label label').ignore('.acf-required').text()+': ',
				value;
			switch ( $(this).data('type') ) {
				case 'true_false':
					value = $(this).find('.acf-input input[type="checkbox"]').prop('checked') ? 'Yes' : 'No';
					break;
				case 'radio':
					value = $(this).find('.acf-input :checked').val();	
					break;
				case 'select':
					value = $(this).find('.acf-input select :selected').text();	
					break;
				case 'wysiwyg':
					// set first line
					value = $( $(this).find('.acf-input textarea').val().split('\n').shift() ).text() + ' [...]';
					break;
				default:
					value = $(this).find('.acf-input input[type!="hidden"]').val();	
					break;
			}
			
			title += '<span class="row-title"><label>'+ label + '</label>' + value + '</span> ';
		});
		if ( ! $fields_td.children('.placeholder').length )
			$fields_td.prepend('<div class="placeholder"></div>');
		$fields_td.children('.placeholder').html(title);

		// collapse row
		$row.addClass('collapsed');
	}

if ( ! $.fn.ignore ) {
	// see: http://stackoverflow.com/questions/11347779/jquery-exclude-children-from-text#answer-11348383
	$.fn.ignore = function(sel){
		return this.clone().find(sel||">*").remove().end();
	};
}
})(jQuery);