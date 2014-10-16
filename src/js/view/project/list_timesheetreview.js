app.view.Project.Overview = Backbone.View.extend({
    _template : _.template( $('#project_overview_template').html() ),
    
    initialize: function() {
        this.render();
    },
    
    onClose: function(){
        // Remove events on close
        this.stopListening();
    },
    
    render: function() {
        this._section_header = new app.view.Section_Header();
        this.$el.html(this._template());
        return this;
    }
});