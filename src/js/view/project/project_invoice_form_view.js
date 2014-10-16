app.view.Project.InvoiceForm = Backbone.View.extend({
    _template : _.template( $('#project_invoice_form_template').html() ),
    
    initialize: function(options) {

        this.$el.html("<div class='loading'></div>");

        $.fancybox(this.$el, app.fancyboxOpts());

        var _this = this;

        if (options.id){
            this.model = new app.model.ProjectInvoice({id: options.id,id_project : options.id_project});

            this.model.fetch({
                success: function(){
                    _this.render();
                }
            })
        }
        else{
            this.model = new app.model.ProjectInvoice({
                date : new Date(),
                id_project : options.id_project
            });
            this.render();
        }

        Backbone.Validation.bind(this);
    },

    events: {
        "click #save" : "save",
        "click #cancel" : "cancel",
        "click #remove": "removeinvoice",
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

    save: function(e){
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

    removeinvoice: function(e){
        e.preventDefault();
        
        this.model.destroy({
            success: function(){
                app.events.trigger("project:change");      
                $.fancybox.close();
            }
        });
    }

    
});