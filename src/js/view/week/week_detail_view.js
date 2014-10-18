app.view.Week.Detail = Backbone.View.extend({
    _template : _.template( $('#week_detail_template').html() ),
    
    initialize: function(options) {
        this.week = new app.model.AdminWeek({_id:options.id}); 
        var _this = this;
        this.week.fetch({
            success: function(){
                _this.render();
            }
        })
        
    },

    events: {
        "click #acceptweek": "accept",
        "click #rejectweek" : "reject",
        "click #addcomment" : "addcomment",
    },
    
    onClose: function(){
        // Remove events on close
        this.stopListening();
    },
    
    render: function() {
        this.$el.html(this._template({
            week: this.week.toJSON()
        }));
      
        return this;
    },

    accept: function(e){
        e.preventDefault();

        $.post(app.config.API_URL + "/weeks/change_status/"+ this.week.id,
            {
                status : app.cons.ST_WEEK_ACCEPTED,
                note : app.input(this.$("textarea[name='newnote']").val())
            }
            ,function(){
                app.router.navigate("weeks", {trigger: true});
            }
        );
    },

    reject: function(e){
        e.preventDefault();

        $.post(app.config.API_URL + "/weeks/change_status/"+ this.week.id,
            {
                status : app.cons.ST_WEEK_REJECTED,
                note : app.input(this.$("textarea[name='newnote']").val())
            }
            ,function(){
                app.router.navigate("weeks", {trigger: true});
            }
        );
    },

    addcomment: function(e){
        e.preventDefault();

        var note = app.input(this.$("textarea[name='newnote']").val());
        if (!note){
            this.$("textarea[name='newnote']").addClass("invalid");
            return;
        }

        var _this = this;
       
        $.post(app.config.API_URL + "/weeks/addcomment/"+ this.week.id,
            {
                comment : note
            }
            ,function(){
                _this.week.fetch({
                    success: function(){
                        _this.render();
                    }
                });
            }
        );

    }


});