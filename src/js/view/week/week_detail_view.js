app.view.Week.Detail = Backbone.View.extend({
    _template : _.template( $('#week_detail_template').html() ),
    
    initialize: function(options) {

        this.$el.html("<div class='loading'></div>");

        $.fancybox(this.$el, app.fancyboxOpts());

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
        "click #sendweek" : "sendweek",
        "click #addcomment" : "addcomment",
        "click #cancel" : "cancel"

    },
    
    onClose: function(){
        // Remove events on close
        this.stopListening();
        $.fancybox.close();
    },
    
    render: function() {
        this.$el.html(this._template({
            week: this.week.toJSON()
        }));
      
        return this;
    },

    accept: function(e){
        e.preventDefault();

        var _this = this;
        $.post(app.config.API_URL + "/weeks/change_status/"+ this.week.id,
            {
                status : app.cons.ST_WEEK_ACCEPTED,
                note : app.input(this.$("textarea[name='newnote']").val())
            }
            ,function(){
                _this.close();
                app.events.trigger("weeks:change");
            }
        );
    },

    reject: function(e){
        e.preventDefault();

        var _this = this;
        $.post(app.config.API_URL + "/weeks/change_status/"+ this.week.id,
            {
                status : app.cons.ST_WEEK_REJECTED,
                note : app.input(this.$("textarea[name='newnote']").val())
            }
            ,function(){
                _this.close();
                app.events.trigger("weeks:change");
            }
        );
    },

    // DEPRECATED
    //  addcomment: function(e){
    //     e.preventDefault();

    //     var note = app.input(this.$("textarea[name='newnote']").val());
    //     if (!note){
    //         this.$("textarea[name='newnote']").addClass("invalid");
    //         return;
    //     }

    //     var _this = this;
       
    //     $.post(app.config.API_URL + "/weeks/addcomment/"+ this.week.id,
    //         {
    //             comment : note
    //         }
    //         ,function(){
    //             _this.week.fetch({
    //                 success: function(){
    //                     _this.render();
    //                 }
    //             });
    //         }
    //     );

    // },

    sendweek: function(e){
        e.preventDefault();

        var newnote = app.input(this.$("textarea[name='newnote']").val());
        var _this = this;
        $.post(app.config.API_URL + "/weeks/" + this.week.get("year") + "/" + this.week.get("week"),{note: newnote},function(){        
            app.events.trigger("timesheet:week:" + _this.week.get("year") + "_" + _this.week.get("week") + ":change");
            _this.close();
        });
    },

    cancel: function(e){
        e.preventDefault();
        
        this.close();
    }


});