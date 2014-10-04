var app = app || {};

app.router = Backbone.Router.extend({
    
    langRoutes : {
        "_link home" : {"en":"home","es": "inicio" },

    },

    /* define the route and function maps for this router */
    routes: {
            "" : "project_overview",
            "notfound" : "notfound",
            "faq" : "faq",
            "error" : "error",
            "login" : "login",
            "logout" : "logout",
<<<<<<< HEAD
=======
            "user/time_sheet" : "timeSheet",

>>>>>>> 375a7dcdeb26d6a8bf840b111abb5f54536782da
            /* Sample usage: http://example.com/#about */
            "*other"    : "defaultRoute"
            /* This is a default route that also uses a *splat. Consider the
            default route a wildcard for URLs that are either not matched or where
            the user has incorrectly typed in a route path manually */
    },

    initialize: function(options) {
        this.route(this.langRoutes["_link home"][app.lang], "home");
    },
    project_overview: function(){
        app.showView(new app.view.Project.Overview());
    },
    home: function(){
        app.showView(new app.view.Home());
    },
    defaultRoute: function(){
        app.showView(new app.view.NotFound());
    },
    notfound: function(){
        app.showView(new app.view.NotFound());
    },

    error: function(){
        app.showView(new app.view.Error());
    },
    login: function(){
        app.showLogin();
    },
    logout: function(){
        app.logout();
    },
    timeSheet: function(){
        app.showView(new app.view.User.TimeSheet());
    }
    
});