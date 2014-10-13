app.view.Menu = Backbone.View.extend({
	_template: _.template($('#menu_template').html()),
	initialize: function(){
		this.render();
		app.events.on('menu:toggle', app.toggleMenu, this);
	},
	render: function(){
		this.$el.html(this._template());
		$('#menu').html(this.$el);
		return this;
	}
});