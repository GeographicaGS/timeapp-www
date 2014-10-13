app.collection.User.WeekTimesheet = Backbone.Collection.extend({
    
    initialize: function(models,options) {
        this._week = options && options.week ? options.week : null;
    },
    
    url : function() {
        return app.config.API_URL + "/timesheet/week/" + this._week ;
    },

    parse: function(response){
        return response.results;
    }
});