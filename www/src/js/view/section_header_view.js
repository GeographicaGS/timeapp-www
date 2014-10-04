app.view.Section_Header = Backbone.View.extend({
    _template : _.template( $('#section_header_template').html() ),
    
    initialize: function() {
        this.render();
    },
    
    onClose: function(){
        // Remove events on close
        this.stopListening();
    },
    
    render: function() {
        this.$el.html(this._template());
        $('header').after(this.$el.html());
        return this;
    }
});