app.view.User.TimeSheet = Backbone.View.extend({
    _template : _.template( $('#timesheet_template').html() ),

    events: {
       // "mousewheel": "getNewWeek",
    },
    
    initialize: function() {
        // $(window).scroll(this.getNewWeek);
        this.weeks=[];

        console.log("timesheet");

        this.userprojects = new app.collection.User.Projects();
        this.userprojects.fetch({reset: true});

        this.listenTo(this.userprojects,"reset",this.render);
    },
    
    onClose: function(){
        // Remove events on close
        for(var i=0; i<this.weeks.lenght; i++){
            this.weeks[i].close();
        }
        this.stopListening();
    },
 
    render: function() {
        this.$el.html(this._template());
        var d = new Date();
        d = this.__getMonday(d);
        var lastDate = new Date(d);
        lastDate.setDate(lastDate.getDate()-7);
        this.weeks.push(new app.view.User.Week({date:d, userprojects: this.userprojects}));
        this.weeks.push(new app.view.User.Week({date:lastDate, userprojects: this.userprojects}));
        this.$('#weeks').append(this.weeks[1].$el);
        this.$('#weeks').append(this.weeks[0].$el);
        this.cont = 1;
        return this;
    },

     getNewWeek:function(e){
        if($(window).scrollTop() < 0){
            this.cont ++;
            var d = d = new Date();
            d = this.__getMonday(d);
            d.setDate(d.getDate()-7*this.cont);
            this.weeks.push(new app.view.User.Week({date:d}));
            this.$('#weeks').prepend(this.weeks[this.weeks.length-1].$el);
        }
     },

     __getMonday:function(d){
        var day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6:1);
        d.setDate(diff);
        return d;
     }

    
});