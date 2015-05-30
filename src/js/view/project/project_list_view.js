app.view.Project.List = Backbone.View.extend({
    _template : _.template( $('#project_list_template').html() ),
    
    initialize: function(options) {
        this.projects = new app.collection.Project.List({},{
            status : 1,
        }); 
        this.listenTo(this.projects,"reset",this.render);
        this.projects.fetch({reset: true});
    },

    events: {
        "change select[name='status']" : "changeStatus"
    },
    
    onClose: function(){
        // Remove events on close
        this.stopListening();
    },

    changeStatus: function(e){
        var $el = $(e.target),
            status = $el.val();

        this.projects.status = status;
        this.projects.fetch({reset: true});
    },
    
    render: function() {
        this.$el.html(this._template({
            projects: this.projects.toJSON(),
            status : this.projects.status
        }));
      

        return this;
    }
});