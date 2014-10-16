app.view.Project.BudgetForm = Backbone.View.extend({
    _template : _.template( $('#project_budget_form_template').html() ),
    
    initialize: function(options) {

        this.$el.html("<div class='loading'></div>");

        $.fancybox(this.$el, app.fancyboxOpts());

        var _this = this;

        if (options.id){
            this.model = new app.model.ProjectBudget({id: options.id,id_project : options.id_project});

            this.model.fetch({
                success: function(){
                    _this.render();
                }
            })
        }
        else{
            this.model = new app.model.ProjectBudget({
                date : new Date(),
                id_project : options.id_project
            });
            this.render();
        }

        Backbone.Validation.bind(this);

    },

    events: {
        "click #savebudget" : "savebudget",
        "click #cancel" : "cancel",
        "click #removebudget": "removebudget",
         "blur input" : "updateModel",
    },

    updateModel: function(e){
        var $e = $(e.target),
            name = $e.attr("name");

        if (name == "date"){
            this.model.set(name,new Date(app.input($e.val())));
        }
        else{
            this.model.set(name,app.input($e.val()));    
        }
        
    },

    onClose: function(){
        // Remove events on close
        this.stopListening();
    },
    
    render: function() {
        this.$el.html(this._template({
            model : this.model.toJSON()
        }));
      
        return this;
    },

    cancel: function(e){
        e.preventDefault();
        $.fancybox.close();
    },

    savebudget: function(e){
        e.preventDefault();

        if (this.model.isValid(true)){

            // Save on server
            this.model.save(null,{
                success: function(model,response){
                    app.events.trigger("project:change");      
                    $.fancybox.close();
                }
            });
        }
        else{
            app.scrollTop();
        }
    },

    removebudget: function(e){
        e.preventDefault();
        
        this.model.destroy({
            success: function(){
                app.events.trigger("project:change");      
                $.fancybox.close();
            }
        });
    }

    
});