app.model.Time = Backbone.Model.extend({
    defaults: {
        date: null,
        hours: 0,
        minutes : 0,
        id_project : null
    },
    validation: function (){
        return {
            date: {
                required : true
            },
            hours: {
                required : true,
                min: 0
            },
            minutes: {
                required : true,
                min: 0,
                max : 59
            },
            id_project: {
                required : true
            }
        }      
    },

    urlRoot: function() {
        return app.config.API_URL + "/timesheet/time";
    }
});