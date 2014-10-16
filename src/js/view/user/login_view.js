app.view.User.Login = Backbone.View.extend({

    _template : _.template( $('#login_template').html() ),

    el : "#login",

    events: {
        "click input[type='button']" : "doLogin"
    },
    
    initialize: function() {
        this.render();
    },
    
    onClose: function(){
        // Remove events on close
        this.stopListening();
    },

    doLogin: function(e){
        e.preventDefault();

        var self = this;
        app.doLogin({
            username: this.$("input[name='username']").val(),
            password: md5(this.$("input[name='password']").val())
        },
        function(){
            self.$(".error").show();
            self.$(".error").html("Invalid username or password");
            setTimeout(function(){
                self.$(".error").hide();
            },6000);
            
        });
    },
    
    render: function() {
        this.$el.html(this._template());
        return this;
    }
});