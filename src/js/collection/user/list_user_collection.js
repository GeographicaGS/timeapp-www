app.collection.User.List = Backbone.Collection.extend({
    model: app.model.User,

    initialize: function(models,options) {
    },
    
    url : function() {
        return app.config.API_URL + "/users/";
    },

    parse: function(response){
        return response.results;
    },

    getUserByid : function(id){
        
        for (var i=0;i<this.length;i++){
            if (this.at(i).get("_id") == id){
                return this.at(i);
            }
        }
        return null;
    },

    getUserByCN : function(cn){
        
        for (var i=0;i<this.length;i++){
            var u = this.at(i);
            if (u.get("name") + " " + u.get("surname") == cn){
                return u;
            }
        }
        return null;
    }
    
});