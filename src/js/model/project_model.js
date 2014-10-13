app.model.Project = Backbone.Model.extend({
    idAttribute: "_id",
    defaults: {
        type_rate: 2,
        hourly_rate : app.config.DEFAULT_PRICE_HOUR
    },

    toJSON : function(){
        var json = Backbone.Model.prototype.toJSON.call(this);
        if (json.members){
            json.members = json.members.toJSON();    
        }
        
        return json;
    },

    validation: function (){
        return {
            name: {
                required: true
            }
        }      
    },

    url: function(){
        if (this.get("slug")){
            return this.urlRoot() + "/" + this.get("slug");    
        }
        else{
            return this.urlRoot();
        }
        
    },
    urlRoot: function() {
        return app.config.API_URL + "/projects";
    },

    parse: function(res, options){
        res.members = new Backbone.Collection(res.members);
        return res;
    }
});