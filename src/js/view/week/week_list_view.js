app.view.Week.List = Backbone.View.extend({
    _template : _.template( $('#week_list_template').html() ),

    initialize: function(options) {
        if (options.userlist)
        {
            this.weeks = new app.collection.Week.List({},{user:true,status: 0});     
        }
        else{
            this.weeks = new app.collection.Week.List({},{status: app.cons.ST_WEEK_SENT}); 
        }
        this.listenTo(this.weeks,"reset",this.render);
        this.weeks.fetch({reset: true});

        var _this = this;
        app.events.on("weeks:change" ,function(){
            _this.weeks.fetch({reset: true});
        });
    },

    events: {
        "change #filterweeks" : "refreshFilter",
        "click [data-week]" : "viewWeek"
    },
    
    onClose: function(){
        // Remove events on close
        this.stopListening();

        if (this.sendWeekView){
            this.sendWeekView.close();
        }
    },
    
    render: function() {
        this.$el.html(this._template({
            weeks: this.weeks.toJSON()
        }));

        
        this.$("#filterweeks").val(this.weeks._status);
        

        return this;
    },

    refreshFilter: function(e){
        this.weeks._status = $(e.target).val();
        this.weeks.fetch({reset: true});
    },

    viewWeek: function(e){
        e.preventDefault();

        if (this.sendWeekView){
            this.sendWeekView.close();
        }

        this.sendWeekView = new app.view.Week.Detail({id: $(e.target).closest("a").attr("data-week")});

    }
});