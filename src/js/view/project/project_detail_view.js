app.view.Project.Detail = Backbone.View.extend({
    _template : _.template( $('#project_detail_template').html() ),
    
    initialize: function(options) {
        var _this = this;
        this.project = new app.model.Project({
            slug: options.slug
        }); 
        this.project.fetch({
            success: function(){
                _this.render();
            }
        });
    },

    events: {
    
    },
    
    onClose: function(){
        // Remove events on close
        this.stopListening();
    },
    
    render: function() {
        this.$el.html(this._template({
            project: this.project.toJSON()
        }));
      
        return this;
    }
});