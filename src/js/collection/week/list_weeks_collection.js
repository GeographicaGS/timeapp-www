app.collection.Week.List = Backbone.Collection.extend({
    model: app.model.Week,

    initialize: function(models,options) {
        this._status = options.status;
        this._user = options.user;
    },
    
    url : function() {
        if (!this._user){
            return app.config.API_URL + "/weeks/list?status=" + this._status;    
        }
        else{
            return app.config.API_URL + "/weeks/user/list?status=" + this._status;
        }
    },

    parse: function(response){
        return response.results;
    }
    
});