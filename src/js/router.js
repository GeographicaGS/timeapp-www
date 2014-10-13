var app = app || {};

app.router = Backbone.Router.extend({
    
    /* define the route and function maps for this router */
    routes: {
            "" : "project_overview",
            "notfound" : "notfound",
            "faq" : "faq",
            "error" : "error",
            "login" : "login",
            "logout" : "logout",
            "home" : "home",
            "users/timesheet" : "timeSheet",
            "users/week" : "week",
            "projects/form(/:slug)": "projectForm",
            "projects" : "projects",
            "projects/:slug" : "projectDetail",
            /* Sample usage: http://example.com/#about */
            "*other"    : "defaultRoute"
            /* This is a default route that also uses a *splat. Consider the
            default route a wildcard for URLs that are either not matched or where
            the user has incorrectly typed in a route path manually */
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
    },
    week: function(){
        app.showView(new app.view.User.Week());
    },
    projectForm: function(slug){
        app.showView(new app.view.Project.Form({
            slug : slug
        }));
    }, 

    projects: function(){
        app.showView(new app.view.Project.List({
            
        }));
    },

    projectDetail: function(slug){
        app.showView(new app.view.Project.Detail({
            slug:slug
        }));
    }
    
});