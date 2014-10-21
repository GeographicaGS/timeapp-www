var ENTER_KEY = 13;

Backbone.View.prototype.close = function () {
    this.remove();
    this.unbind();

    if (this.onClose) {
        this.onClose();
    }
};

String.prototype.endsWith = function (suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

$(function () {
    $(document).ajaxError(function (event, jqxhr, settings, exception) {
        if (jqxhr.status == 404) {
            app.router.navigate("notfound", {trigger: true});
        }
        else if (jqxhr.status == 401) {
            localStorage.removeItem("user");
            app.nextRoute = "users/timesheet";
            app.router.navigate("login", {trigger: true});
        }
        else {
            app.router.navigate("error", {trigger: true});
        }
    });

    $("body").on("click", "a", function (e) {
        var attr = $(this).attr("jslink"),
                href = $(this).attr("href");

        if (attr != undefined && attr != "undefined") {
            e.preventDefault();
            if (href == "#back") {
                history.back();
            }
            app.router.navigate($(this).attr("href").substring(3), {trigger: true});
        }
    });

    $('.menu-btn, .menu-item').on('click', function (e) {
        e.preventDefault();
        app.events.trigger("menu:toggle");
    });

    app.ini();

    $(document).resize(function () {
        app.resizeMe();
    });

    app.resizeMe();

    

});

app.resizeMe = function () {

};

app.detectCurrentLanguage = function () {
    // Detect lang analyzing the URL
    if (document.URL.indexOf("/es/") != -1 || document.URL.endsWith("/es")) {
        return "es";
    }
    else if (document.URL.indexOf("/en/") != -1 || document.URL.endsWith("/en")) {
        return "en";
    }

    return null;
};

app.ini = function () {

    this.lang = this.detectCurrentLanguage();
    this.router = new app.router();
    this.basePath = this.config.BASE_PATH + this.lang;

    this.$main = $("main");

    this.login = new app.view.User.Login();

    this.setAjaxSetup();

    //check if user us logged in
    var user = localStorage.getItem("user");
    if (user) {
        this.user = JSON.parse(user);
        // check user is really logged in
        this.doLogin(this.user, function () {
            // something was bad
            app.router.navigate("login", {trigger: true});
        });

    }
    else {
        $("#loadingstart").hide();
        // GO directly to login
        app.router.navigate("login", {trigger: true});
    }
};

app.loginComplete = function(){

    this.userlist = new app.collection.User.List();
    this.userlist.fetch({
        "success" : function(){
            if (!Backbone.History.started){
                Backbone.history.start({pushState: true, root: app.basePath});    
            }
            $("#topusername").html(app.user.name + " " + app.user.surname);
            if (app._menuView){
                app._menuView.render();    
            }
            else{
                app._menuView = new app.view.Menu();    
            }
            if (app.user.profile >= app.cons.ST_PROFILE_GESTOR){
                $(".new-proyect").show();
            }
            else{
                $(".new-proyect").hide();   
            }
            app.closeLogin();

            if (Backbone.history.fragment===undefined || Backbone.history.fragment==="undefined" 
                || Backbone.history.fragment==="logout" || Backbone.history.fragment==="login"){
                app.router.navigate("users/timesheet",{trigger: true});
            }
        }
    });
};

app.showLogin = function () {
    if (!app.isUserLogged()) {
        app.login.$el.show();
    }
};

app.closeLogin = function () {
    app.login.$el.hide();
    $("#loadingstart").hide();
};

app.doLogin = function (user, error) {
   
    this.user = user;

    $.ajax({
        url: app.config.API_URL + "/users/islogged",

        success: function(usercomplete){

            app.user = usercomplete;
            app.user["password"] = user["password"];
            localStorage.setItem("user",JSON.stringify(app.user));
            app.loginComplete();
        },
        error: function (jqxhr, settings, exception) {
            localStorage.removeItem("user");
            if (jqxhr.status == 401) {
                error();
            }
        }
    });
};

app.isUserLogged = function () {
    return localStorage.getItem("user") != null;
}

app.logout = function () {
    localStorage.removeItem("user");
    app.showLogin();
    if (this.currentView) {
        this.currentView.close();
    }
}

app.getAuthHeaders = function () {
    if (this.user) {
        var timestamp = new Date().getTime();

        return {
            "auth-username": this.user.username,
            "auth-timestamp": timestamp,
            "auth-hash": md5(this.user.username + this.user.password + timestamp)
        }
    }
    else {
        return {}
    }

};

app.setAjaxSetup = function () {

    $.ajaxSetup({
        headers: app.getAuthHeaders,
        beforeSend: function (xhr) {
            headers = app.getAuthHeaders();
            for (h in headers) {
                xhr.setRequestHeader(h, headers[h]);
            }
        }
    });

}

app.showView = function (view) {
    if (this.currentView) {
        this.currentView.close();
    }

    this.currentView = view;

    this.$main.html(this.currentView.el);
    app.scrollTop();
};

app.events = {};

_.extend(app.events, Backbone.Events);

app.scrollTop = function () {
    var body = $("html, body");
    body.animate({scrollTop: 0}, '500', 'swing', function () {

    });
};

app.scrollToEl = function ($el) {
    $('html, body').animate({
        scrollTop: $el.offset().top
    }, 500);
};

app.nl2br = function nl2br(str, is_xhtml) {
    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
};


app.urlify = function (text, attr) {
    if (!text) {
        return ""
    }
    var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/i;
    return text.replace(exp, "<a href='$1' " + attr + ">$1</a>");
};

app.loadingHTML = function () {
    return "<div class='container'>"
            + "<div class='row'>"
            + "<div class='grid-md-10 col-md-offset-2'>"
            + "<div class='loading'><lang>Loading</lang></div>"
            + "</div>"
            + "</div>"
            + "</div>";
};

app.renameID = function (array, oldID, newID) {
    for (var i = 0; i < array.length; i++) {
        array[i][newID] = array[i][oldID];
        delete array[i][oldID];
    }
    return array;
};

app.input = function(str){
    str = $.trim(str);
    if (str === "")
        return null;
    return str;
}

app.formatNumber = function (n,decimals){

    console.log(n);
    if (n===null || n===undefined){
        return "--";
    }

    if (decimals ===null || decimals === undefined){
        decimals = 2;
    }

    if (typeof n == "number"){
        return parseFloat(sprintf("%."+ decimals + "f",n)).toLocaleString(app.lang, {
            style: 'decimal', 
            minimumFractionDigits: decimals
        });
    }
    else{
        
        if (n.indexOf(".") != -1){
            n = sprintf("%."+ decimals + "f",n);
            return parseFloat(n).toFixed(decimals).toLocaleString(app.lang, {
                style: 'decimal', 
                minimumFractionDigits: decimals
            });   
        }
        else{
            return parseInt(n).toLocaleString(app.lang, {
                style: 'decimal', 
                minimumFractionDigits: decimals 
            });
        }    
    }
};

app.cons = {
   
    "ST_PROJECT_OPEN" : 1,
    "ST_PROJECT_ARCHIVE" : 2,

    "ST_USER_ENABLE" : 1,
    "ST_USER_DISABLE" : 2,

    "ST_PROFILE_CLIENT" : 10,
    "ST_PROFILE_USER" : 20,
    "ST_PROFILE_GESTOR" : 30,
    "ST_PROFILE_ADMIN" : 40,

    "ST_WEEK_PENDING" : 1,
    "ST_WEEK_SENT" : 2,
    "ST_WEEK_REJECTED" : 3,
    "ST_WEEK_ACCEPTED" : 4,
};

app.weekStatusToStr = function(status){
    switch(status){
        case app.cons.ST_WEEK_PENDING:
            return "<lang>Pending</lang>"
        case app.cons.ST_WEEK_SENT:
            return "<lang>Sent</lang>"
        case app.cons.ST_WEEK_REJECTED:
            return "<lang>Rejected</lang>"
        case app.cons.ST_WEEK_ACCEPTED:
            return "<lang>Accepted</lang>"

        default:
            return "Unknown status";
    }
}

app.fancyboxOpts = function(){

    return   {
        padding : 0,
        //autoHeight : false,
        //autoSize : false,
        // width : "90%",
        // maxWidth : 960,
        //closeBtn : true,
        modal : true,
        helpers : {
            overlay : {
                css : {
                    'background' : 'rgba(40, 40, 40, 0.75)'
                }
            }
        }
    }  
};

app.escapeHtml = function(text) {
  var map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };

  return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}
