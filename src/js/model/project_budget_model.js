app.model.ProjectBudget = Backbone.Model.extend({
    
    validation: function (){
        return {
            desc: {
                required: true,
                minLength: 3,
                maxLength : 60
            },
            date: {
                required: true,
            },
            amount: {
                required:true,
                min: 1
            }
        }      
    },

    urlRoot: function() {
        return app.config.API_URL + "/projects/" + this.get("id_project") + "/budgets";
    }

});