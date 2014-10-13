app.view.Project.List = Backbone.View.extend({
    _template : _.template( $('#project_list_template').html() ),
    
    initialize: function(options) {
        this.projects = new app.collection.Project.List(); 
        this.listenTo(this.projects,"reset",this.render);
        this.projects.fetch({reset: true});
    },

    events: {
    
    },
    
    onClose: function(){
        // Remove events on close
        this.stopListening();
    },
    
    render: function() {
        this.$el.html(this._template({
            projects: this.projects.toJSON()
        }));
      

        return this;
    }
});