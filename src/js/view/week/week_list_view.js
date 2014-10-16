app.view.Week.List = Backbone.View.extend({
    _template : _.template( $('#week_list_template').html() ),
    
    initialize: function(options) {
        this.weeks = new app.collection.Week.List({},{status: app.cons.ST_WEEK_SENT}); 
        this.listenTo(this.weeks,"reset",this.render);
        this.weeks.fetch({reset: true});
    },

    events: {
    
    },
    
    onClose: function(){
        // Remove events on close
        this.stopListening();
    },
    
    render: function() {
        this.$el.html(this._template({
            weeks: this.weeks.toJSON()
        }));
      

        return this;
    }
});