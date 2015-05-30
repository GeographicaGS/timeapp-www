app.view.Project.Detail = Backbone.View.extend({
    _template : _.template( $('#project_detail_template').html() ),
    
    __weekstart : null,
    __weekend : null,

    initialize: function(options) {
        
        this.__weekstart = options.weekstart ? options.weekstart : null;
        this.__weekend = options.weekend ? options.weekend : null;

        this.project = new app.model.ProjectAdmin({
            slug: options.slug,
            weekstart: this.__weekstart,
            weekend : this.__weekend
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
        "click a[data-budget]" : "editbudget",
        "click a#ctrl_date_filter" : "applyDateFilter"
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
    
    // render: function() {
    //     this.$el.html(this._template({
    //         project: this.project.toJSON()
    //     }));
      
    //     return this;
    // },


    render: function() {

        // overwrite aamounts 
        this.$el.html(this._template({
            project: this.project.toJSON(),
            weekstart: this.__weekstart,
            weekend: this.__weekend
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
    },

    applyDateFilter: function(e){
        e.preventDefault();

        var date_start = this.$("input[name='date_filter_start']").val();
        var date_end = this.$("input[name='date_filter_end']").val();

        if (!date_start || !date_end){
            alert("Please select both dates");
        }
        else{
            date_start = date_start.replace("W","");
            date_end = date_end.replace("W","");
            app.router.navigate("/projects/" + this.project.get("slug") + "/" + date_start + "/" + date_end , {trigger: true});
        }

       
    }

});