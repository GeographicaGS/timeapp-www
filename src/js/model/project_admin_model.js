app.model.ProjectAdmin = app.model.Project.extend({
    idAttribute: "_id",
   
    urlRoot: function() {
        return app.config.API_URL + "/projects/adminversion";
    },

    parse: function(res, options){
        res.members = new Backbone.Collection(res.members);
        return res;
    }
});