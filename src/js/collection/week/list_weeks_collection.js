app.collection.Week.List = Backbone.Collection.extend({
    model: app.model.Week,

    initialize: function(models,options) {
        this._status = options && options.status ? options.status : null;
    },
    
    url : function() {
        return app.config.API_URL + "/weeks/list?status=" + this._status;
    },

    parse: function(response){
        return response.results;
    }
    
});