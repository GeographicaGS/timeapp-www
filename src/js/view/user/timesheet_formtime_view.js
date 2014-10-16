app.view.User.TimeSheetFormTime = Backbone.View.extend({
    _template : _.template( $('#timesheet_formtime_template').html() ),

    events: {
        "click #save": "save",
        "click #cancel_addtime": "hide",
        "click #deletetime": "delete"
    },
    
    initialize: function(opts) {
        this.projects = opts.projects;
        Backbone.Validation.bind(this);
        this.render();
    },
    
    onClose: function(){
        this.stopListening();
    },
 
    /*
    opts: {
        date
    }
    */
    render: function() {
        
        this.$el.html(this._template({
            projects : this.projects,
            model: this.model.toJSON()
        }));

        return this;
    },

    save: function(e){
        e.preventDefault();

        var data = {
            id_project : app.input(this.$("select[name='id_project']").val()),
            hours : app.input(this.$("input[name='hours']").val()),
            minutes : app.input(this.$("input[name='minutes']").val())
        };

        this.model.set(data);

        if (this.model.isValid(true)){
            var _this = this;
            this.model.save(null,{
                success: function(){
                    var date = _this.model.get("date"),
                        year = date.isoWeekYear(),
                        week = date.isoWeek();
                    app.events.trigger("timesheet:week:" + year + "_" + week+":change");
                }
            });
           
        }
    },

    hide: function(e){
        e.preventDefault();

        this.close();
    },

    delete: function(e){
        e.preventDefault();

        var _this = this;
        this.model.destroy({
            success: function(){
                var date = _this.model.get("date"),
                    year = date.isoWeekYear(),
                    week = date.isoWeek();
                app.events.trigger("timesheet:week:" + year + "_" + week+":change");
            }
        });
    }
});