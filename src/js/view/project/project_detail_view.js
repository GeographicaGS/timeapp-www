app.view.Project.Detail = Backbone.View.extend({
    _template : _.template( $('#project_detail_template').html() ),
    
    initialize: function(options) {
        
        this.project = new app.model.Project({
            slug: options.slug
        }); 
       
        this._fetchProject();

        var _this = this;
        app.events.on("project:change",function(){
            _this._fetchProject();            
        });
    },

    _fetchProject: function(){
        var _this = this;
        this.project.fetch({
            success: function(){
                _this.render();
            }
        });
    },

    events: {
        "click #addbudget" : "addbudget",
        "click #addspending" : "addspending",
        "click a[data-spending]" : "editspending",
        "click #addinvoice" : "addinvoice",
        "click a[data-invoice]" : "editinvoice",
        "click a[data-budget]" : "editbudget"
    },
    
    onClose: function(){
        // Remove events on close
        this.stopListening();

        if (this.spendingform){
            this.spendingform.close();
            this.spendingform = null;
        }

        if (this.invoiceform){
            this.invoiceform.close();
            this.invoiceform = null;
        }

        if (this.budgetform){
            this.budgetform.close();
            this.budgetform = null;
        }

    },
    
    render: function() {
        this.$el.html(this._template({
            project: this.project.toJSON()
        }));
      
        return this;
    },

    addspending: function(e){
        e.preventDefault();

        if (this.spendingform){
            // close posible previous view
            this.spendingform.close();
        }

        this.spendingform = new app.view.Project.SpendingForm({id_project: this.project.id});
    },

    editspending: function(e){
         e.preventDefault();

        if (this.spendingform){
            // close posible previous view
            this.spendingform.close();
        }

        this.spendingform = new app.view.Project.SpendingForm({
            id : $(e.target).closest("a").attr("data-spending"),
            id_project: this.project.id
        });
    },

    addinvoice: function(e){
        e.preventDefault();

        if (this.invoiceform){
            // close posible previous view
            this.invoiceform.close();
        }

        this.invoiceform = new app.view.Project.InvoiceForm({id_project: this.project.id});
    },

    editinvoice: function(e){
         e.preventDefault();

        if (this.invoiceform){
            // close posible previous view
            this.invoiceform.close();
        }

        this.invoiceform = new app.view.Project.InvoiceForm({
            id : $(e.target).closest("a").attr("data-invoice"),
            id_project: this.project.id
        });
    },

    addbudget: function(e){
        e.preventDefault();

        if (this.budgetform){
            // close posible previous view
            this.budgetform.close();
        }

        this.budgetform = new app.view.Project.BudgetForm({id_project: this.project.id});
    },

    editbudget: function(e){
         e.preventDefault();

        if (this.budgetform){
            // close posible previous view
            this.budgetform.close();
        }

        this.budgetform = new app.view.Project.BudgetForm({
            id : $(e.target).closest("a").attr("data-budget"),
            id_project: this.project.id
        });
    }

});