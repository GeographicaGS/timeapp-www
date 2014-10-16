app.model.AdminWeek = Backbone.Model.extend({
    idAttribute: "_id",
    
    urlRoot: function() {
        return app.config.API_URL + "/weeks" ;
    }
});