app.view.User.TimeSheetSendWeek  = Backbone.View.extend({
    _template : _.template( $('#timesheet_sendweek_template').html() ),

    events: {
        "click #sendtimesheet": "send",
        "click #cancel" : "closeMe"
    },

    initialize: function(options){

        this.$el.html("<div class='loading'></div>");

        $.fancybox(this.$el, app.fancyboxOpts());

        this.render();
    },

    render: function(){
        this.$el.html(this._template({
           model: this.model.toJSON()
        }));

        return this;
    },

    send: function(e){
        e.preventDefault();

        var newnote = app.input(this.$("textarea[name='newnote']").val());
        var _this = this;
        $.post(app.config.API_URL + "/weeks/" + this.model.get("year") + "/" + this.model.get("week"),{note: newnote},function(){
            _this.model.fetch({
                success: function(){
                    app.events.trigger("timesheet:week:" + _this.model.get("year") + "_" + _this.model.get("week") + ":change");
                    _this.closeMe();            
                }
            });  
        });
    },

    closeMe: function(e){
        if (e)
            e.preventDefault();
        $.fancybox.close();
        this.close();

    }

});
