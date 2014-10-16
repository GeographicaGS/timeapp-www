app.model.User = Backbone.Model.extend({
    idAttribute: "_id",

    cn: function(){
        return this.get("name") + " " + this.get("surname");
    }
});