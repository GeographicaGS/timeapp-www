app.model.ProjectAdmin = app.model.Project.extend({
    idAttribute: "_id",
   
    urlRoot: function() {
        return app.config.API_URL + "/projects/adminversion";
    },

    url: function(){
        var url = this.urlRoot() + "/" + this.get("slug");

        if (this.get("weekstart") && this.get("weekend")){
            url += "/" + this.get("weekstart") + "/" + this.get("weekend");    
        }

        return url;
    },

    parse: function(res, options){
        res.members = new Backbone.Collection(res.members);
        return res;
    }
});