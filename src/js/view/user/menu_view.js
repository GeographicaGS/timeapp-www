app.view.Menu = Backbone.View.extend({
	_template: _.template($('#menu_template').html()),

	initialize: function(){
		this.render();

		app.events.on('menu:toggle', function(){
			this.toggleMenu();
		},this);

		app.events.on("menu", function (id,nottooglemenu) {
		    $("#menu li").removeClass("selected");
		    $("#menu li a[data-menu='"+id+"']").closest("li").addClass("selected");

		    // hide menu
		     $('#menu').removeClass().addClass('expandClose');
		   
		    
		});
	},

	onClose: function(){
        // Remove events on close
        this.stopListening();
    },
    
	render: function(){
		this.$el.html(this._template());
		$('#menu').html(this.$el);
		return this;
	},

	toggleMenu: function(){

	    if ($('#menu').hasClass('expandOpen')) {
	        $('#menu').removeClass().addClass('expandClose');
	    }
	    else if ($('#menu').hasClass('expandClose') || typeof $('#menu').attr('class') === 'undefined' ) {
	        $('#menu').removeClass().addClass('expandOpen');
	    }

	}
});