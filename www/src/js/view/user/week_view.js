var days = ["Domingo","Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sábado"];
var months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Nomviembre", "Diciembre"];

app.view.User.Week = Backbone.View.extend({
    _template : _.template( $('#week_template').html() ),

    events: {
        
    },
    
    initialize: function(options) {
        this.date = options.date;
        this.render();
    },
    
    onClose: function(){
        // Remove events on close
        this.stopListening();
    },
 
    render: function() {
        this.$el.html(this._template({date:this.date}));
        return this;
    }
});