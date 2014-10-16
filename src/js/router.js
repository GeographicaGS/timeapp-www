var app = app || {};

app.router = Backbone.Router.extend({
    
    /* define the route and function maps for this router */
    routes: {
            "" : "index",
            "notfound" : "notfound",
            "faq" : "faq",
            "error" : "error",
            "login" : "login",
            "logout" : "logout",
            "users/timesheet" : "timesheet",
            "users/week" : "week",
            "projects/form(/:slug)": "projectForm",
            "projects" : "projects",
            "projects/:slug" : "projectDetail",
            "weeks" : "weeks",
            "weeks/me" : "userWeeks",
            "weeks/:id" : "weekDetail",
            /* Sample usage: http://example.com/#about */
            "*other"    : "defaultRoute"
            /* This is a default route that also uses a *splat. Consider the
            default route a wildcard for URLs that are either not matched or where
            the user has incorrectly typed in a route path manually */
    },
    index: function(){
        app.router.navigate("users/timesheet");
        this.timesheet();
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
    timesheet: function(){
        app.events.trigger("menu","timesheet");
        app.showView(new app.view.User.TimeSheet());
    },
    week: function(){
        app.events.trigger("menu","weeks");
        app.showView(new app.view.User.Week());
    },
    projectForm: function(slug){
        app.events.trigger("menu","projects",true);
        app.showView(new app.view.Project.Form({
            slug : slug
        }));
    }, 

    projects: function(){
        app.events.trigger("menu","projects");
        app.showView(new app.view.Project.List({
            
        }));
    },

    projectDetail: function(slug){
        app.events.trigger("menu","projects");
        app.showView(new app.view.Project.Detail({
            slug:slug
        }));
    },

    weeks: function(){
        app.events.trigger("menu","weeks");
        app.showView(new app.view.Week.List({}));
    },

    userWeeks: function(){
        app.events.trigger("menu","userweeks");
        app.showView(new app.view.Week.List({}));
    },

    weekDetail: function(id){
        app.events.trigger("menu","weeks");
        app.showView(new app.view.Week.Detail({
            id : id
        }));
    }
    
});