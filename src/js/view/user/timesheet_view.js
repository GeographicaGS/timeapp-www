app.view.User.TimeSheet = Backbone.View.extend({
    _template : _.template( $('#timesheet_template').html() ),

    events: {
       "mousewheel": "getNewWeek",
    },
    
    initialize: function() {
        // $(window).scroll(this.getNewWeek);
        this.loadLastWeek = true;
        this.weeks=[];

        this.cont = 0;

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

        if(!app.config.START_DATE || lastDate >= new Date(app.config.START_DATE)){
            this.weeks.push(new app.view.User.Week({date:lastDate, userprojects: this.userprojects, parentView:this}));
            this.$('#weeks').append(this.weeks[1].$el);
            this.cont = 1;
        }

        this.$('#weeks').append(this.weeks[0].$el);
        return this;
    },

     getNewWeek:function(e){

        if(this.loadLastWeek && $(window).scrollTop() <= 0){
            this.loadLastWeek = false;
            var self = this;
            setTimeout(function(){
                if($(window).scrollTop() <= 0){
                    self.__getNewWeek(e)
                }else{
                    self.loadLastWeek = true;
                }
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
            this.cont ++;
            var d = d = new Date();
            d = this.__getMonday(d);
            d.setDate(d.getDate()-7*this.cont);
            if(!app.config.START_DATE || d >= new Date(app.config.START_DATE)){
                this.undelegateEvents();
                this.weeks.push(new app.view.User.Week({date:d, userprojects: this.userprojects, parentView:this}));
                this.weeks[this.weeks.length-1].$el.hide();
                this.$('#weeks').prepend(this.weeks[this.weeks.length-1].$el);
                var self = this;
                this.weeks[this.weeks.length-1].$el.fadeIn("slow", function(){
                    self.loadLastWeek = true;
                });
            }
        // }
     }

    
});