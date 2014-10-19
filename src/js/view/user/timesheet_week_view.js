var days = ["Domingo","Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sábado"];
var months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Nomviembre", "Diciembre"];

app.view.User.Week = Backbone.View.extend({
    _template : _.template( $('#timesheet_week_template').html() ),

    events: {
        "click .projtime" : "showProject",
        "click .ctrl_addtime": "showAddTime",
        "click .formweek": "formWeek"
    },
    
    initialize: function(options) {
        this.date = moment(options.date); 
        this.year = this.date.isoWeekYear();
        this.week = this.date.isoWeek();
        this.userprojects = options.userprojects;

        this.collection = new app.collection.User.WeekTimesheet({},{
            year : this.year,
            week : this.week
        });
        this.listenTo(this.collection,"reset",this.render);

        this.weekModel = new app.model.Week({
            "year" : this.year,
            "week": this.week
        });

        var _this = this;

        this.weekModel.fetch({
            success: function(model,response){
                _this.collection.fetch({reset: true});
            }
        });

        app.events.on("timesheet:week:" + this.year + "_" + this.week + ":change",function(){
            _this.refresh();
        });
    },
    
    onClose: function(){
        // Remove events on close
        this.stopListening();
        if (this.addTimeView){
            this.addTimeView.close();
        }

        if (this.sendWeekView){
            this.sendWeekView.close();
        }
    },

    refresh: function(){
        if (this.addTimeView) this.addTimeView.close();
        // let's refresh this week
        this.collection.fetch({reset: true});
    },
 
    render: function() {
      
        var weektime = this.collection.toJSON(),
            maxweekhours = _.max(weektime, function(d){ return d.total_hours; }).total_hours;

        this.$el.html(this._template({
            date:this.date,
            weektime: weektime,
            maxweekhours : maxweekhours,
            dataweek: this.weekModel.toJSON(),
            weekblocked: this.isWeekBlocked()
        }));

        var projhourswidth =  $(".timeLine").width() - $(".ctrl_addtime").width() 
                - $(".totalelements").outerWidth(true) - $(".elements").position().left - 30;

        for (var i=0;i<weektime.length;i++){
            for (var j=0;j<weektime[i].projects.length;j++){
                var elwidth = (projhourswidth*weektime[i].projects[j].nhours) / maxweekhours;
                this.$(".projtime[data-day="+i + "][data-proj-idx="+ j+ "]").width(elwidth);
            }
        }

        return this;
    },

    showAddTime: function(e){
        e.preventDefault();

        var $e = $(e.target);

        if (this.addTimeView) this.addTimeView.close();

        var date = moment($e.attr("data-date"));
        var day = date.isoWeekday();
        var dayprojects = _.pluck(this.collection.toJSON()[day-1].projects,"id_project");
        var availableprojects = _.filter(this.userprojects.toJSON(),function (p) { return dayprojects.indexOf(p._id)==-1; });

        this.addTimeView = new app.view.User.TimeSheetFormTime({
            projects : availableprojects ,
            model: new app.model.Time({
                date: date
            })
        });

        $("#addtime").html(this.addTimeView.el);
    },

    isWeekBlocked : function(e){
        return ! (this.weekModel.get("status") == app.cons.ST_WEEK_PENDING || this.weekModel.get("status") == app.cons.ST_WEEK_REJECTED);
    },

    showProject: function(e){
        e.preventDefault();

        var $e = $(e.target),
            day_idx = $e.attr("data-day"),
            proj_idx = $e.attr("data-proj-idx");

        if (this.addTimeView) this.addTimeView.close();

        var projtime = this.collection.at(day_idx).get("projects")[proj_idx];
        
        var model = new app.model.Time({
            id: projtime.id,
            date: moment($e.attr("data-date")),
            id_project : projtime.id_project,
            hours : parseInt(projtime.nhours),
            minutes : parseInt(projtime.nhours % 1 * 60)
        });

        var availableprojects = _.filter(this.userprojects.toJSON(),function (p) { return p._id == projtime.id_project; });

        this.addTimeView = new app.view.User.TimeSheetFormTime({
            projects : availableprojects ,
            model: model,
            weekblocked : this.isWeekBlocked()
        });

        $("#addtime").html(this.addTimeView.el);
    },

    formWeek: function(e){
        e.preventDefault();

        $.post(app.config.API_URL + "/weeks/requestweekid/"+ this.year + "/" + this.week,function(data){
            if (data){
                if (this.sendWeekView ){
                    this.sendWeekView.close();
                }
                this.sendWeekView = new app.view.Week.Detail({id: data.id});
            }
        });
        
    }

});