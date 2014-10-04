app.collection.User.Timesheet = Backbone.Collection.extend({
    
    initialize: function(models,options) {
        // this._week = options && options.week ? options.week : null;
    },
    
    url : function() {
        return app.config.API_URL + "/users/" + app.user.username + "/timesheet" ;
    },

    parse: function(response){
        return response.results;
    }
});