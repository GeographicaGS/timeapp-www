app.model.Week = Backbone.Model.extend({
    idAttribute: "_id",
    url: function(){
        return app.config.API_URL + "/weeks/" + this.get("year") + "/" + this.get("week");
    },

    // urlRoot: function() {
    //     return app.config.API_URL + "/weeks/" + this.get("year") + "/" + this.get("week");
    // }
});