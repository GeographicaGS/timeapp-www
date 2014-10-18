app.collection.User.WeekTimesheet = Backbone.Collection.extend({
    
    initialize: function(models,options) {
        this._week = options && options.week ? options.week : null;
        this._year = options && options.year ? options.year : null;
    },
    
    url : function() {
        return app.config.API_URL + "/timesheets/userweek/" + this._year + "/" + this._week ;
    },

    parse: function(response){
        return response.results;
    }
});