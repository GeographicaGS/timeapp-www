var days = ["Domingo","Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sábado"];
var months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Nomviembre", "Diciembre"];

app.view.User.Week = Backbone.View.extend({
    _template : _.template( $('#week_template').html() ),

    events: {
        "click .projtime" : "showProject",
        "click .ctrl_addtime": "showAddTime"
    },
    
    initialize: function(options) {
        this.date = options.date; 
        this.userprojects = options.userprojects;
        this.collection = new app.collection.User.WeekTimesheet({},{ week : this.date.getWeekNumber()});
        this.listenTo(this.collection,"reset",this.render);
        this.collection.fetch({reset: true});

        var _this = this;
        app.events.on("timesheet:week:" + this.date.getWeekNumber()+":change",function(){
            _this.refresh();
        });
    },
    
    onClose: function(){
        // Remove events on close
        this.stopListening();
        if (this.addTimeView){
            this.addTimeView.close();
        }
    },

    refresh: function(){
        if (this.addTimeView) this.addTimeView.close();
        // let's refresh this week
        this.collection.fetch({reset: true});
    },
 
    render: function() {
        this.$el.html(this._template({
            date:this.date,
            weektime: this.collection.toJSON() 
        }));
        return this;
    },

    showAddTime: function(e){
        e.preventDefault();

        var $e = $(e.target);

        if (this.addTimeView) this.addTimeView.close();

        var day = app.getDay(this.date);
        var dayprojects = _.pluck(this.collection.toJSON()[day].projects,"id_project");
        var availableprojects = _.filter(this.userprojects.toJSON(),function (p) { return dayprojects.indexOf(p._id)==-1; });

        this.addTimeView = new app.view.User.TimeSheetAddTime({
            projects : availableprojects ,
            model: new app.model.Time({
                date: new Date($e.attr("data-date"))
            })
        });

        $("#addtime").html(this.addTimeView.el);
    },

    showProject: function(e){
        e.preventDefault();

        var $e = $(e.target),
            day = $e.attr("data-day"),
            proj_idx = $e.attr("data-proj-idx");

        if (this.addTimeView) this.addTimeView.close();

        var projtime = this.collection.at(day).get("projects")[proj_idx];
        
        var model = new app.model.Time({
            id: projtime.id,
            date: new Date($e.attr("data-date")),
            id_project : projtime.id_project,
            hours : parseInt(projtime.nhours),
            minutes : parseInt(projtime.nhours % 1 * 60)
        });

        var availableprojects = _.filter(this.userprojects.toJSON(),function (p) { return p._id == projtime.id_project; });

        this.addTimeView = new app.view.User.TimeSheetAddTime({
            projects : availableprojects ,
            model: model
        });

        $("#addtime").html(this.addTimeView.el);
    }   

});