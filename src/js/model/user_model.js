app.model.User = Backbone.Model.extend({
    idAttribute: "_id",

    cn: function(){
        return this.get("name") + " " + this.get("surname");
    },

    gravatar: function(){
        return "http://www.gravatar.com/avatar/" + md5(this.get("email"));
    }
});