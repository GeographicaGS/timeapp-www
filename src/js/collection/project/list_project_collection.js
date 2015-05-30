app.collection.Project.List = Backbone.Collection.extend({
    model: app.model.Project,
    status : 1,
    initialize: function(models,options) {
        this.status = options.status ? options.status : 1;
    },
    
    url : function() {
        return app.config.API_URL + "/projects/list/" + this.status;
    },

    parse: function(response){
        return response.results;
    }
    
});