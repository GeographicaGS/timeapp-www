app.view.User.TimeSheet = Backbone.View.extend({
    _template : _.template( $('#time_sheet_template').html() ),

    events: {
        
    },
    
    initialize: function() {
        this.render();
    },
    
    onClose: function(){
        // Remove events on close
        this.stopListening();
    },
 
    render: function() {
        this.$el.html(this._template());
        return this;
    }
});