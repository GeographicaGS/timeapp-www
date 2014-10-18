app.view.User.TimeSheet = Backbone.View.extend({
    _template : _.template( $('#timesheet_template').html() ),

    events: {
       "mousewheel": "getNewWeek",
    },
    
    initialize: function() {
        // $(window).scroll(this.getNewWeek);
        this.loadLastWeek = true;
        this.weeks=[];

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
        this.weeks.push(new app.view.User.Week({date:d, userprojects: this.userprojects, parentView:this}));
        this.weeks.push(new app.view.User.Week({date:lastDate, userprojects: this.userprojects, parentView:this}));
        this.$('#weeks').append(this.weeks[1].$el);
        this.$('#weeks').append(this.weeks[0].$el);
        this.cont = 1;
        return this;
    },

     getNewWeek:function(e){
        // if(this.timeout) {
        //     clearTimeout(this.timeout);
        //     timeout = null;
        // }
        // this.timeout = setTimeout(this.__getNewWeek(e), 100000);
        if(this.loadLastWeek && $(window).scrollTop() < 0){
            this.loadLastWeek = false;
            var self = this;
            setTimeout(function(){
                self.__getNewWeek(e)
            },500);
        }
        
     },

     __getMonday:function(d){
        var day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6:1);
        d.setDate(diff);
        return d;
     },

     __getNewWeek:function(e){
        // if($(window).scrollTop() <= 0){
            this.undelegateEvents();
            this.cont ++;
            var d = d = new Date();
            d = this.__getMonday(d);
            d.setDate(d.getDate()-7*this.cont);
            this.weeks.push(new app.view.User.Week({date:d, userprojects: this.userprojects, parentView:this}));
            this.weeks[this.weeks.length-1].$el.hide();
            this.$('#weeks').prepend(this.weeks[this.weeks.length-1].$el);
            var self = this;
            this.weeks[this.weeks.length-1].$el.fadeIn("slow", function(){
                self.loadLastWeek = true;
            });
        // }
     }

    
});