app.collection.User.Projects = Backbone.Collection.extend({
    model: app.model.Project,
    
    initialize: function(models,options) {
    },
    
    url : function() {
        return app.config.API_URL + "/users/projects";
    },

    parse: function(response){
        return response.results;
    }
    
});