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

    this._menuView = new app.view.Menu();

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

    this.setAjaxSetup();

    //Backbone.history.start();root: "/public/search/"
    

    //check if user us logged in

    var user = localStorage.getItem("user");
    if (user) {
        this.user = JSON.parse(user);
        // check user is really logged in
        this.doLogin(this.user, null, function () {
            // something was bad
            app.router.navigate("login", {trigger: true});
        });

        app.userlist = new app.collection.User.List();
        app.userlist.fetch({
            "success" : function(){
                Backbone.history.start({pushState: true, root: app.basePath});
            }
        });


    }
    else {
        // GO directly to login
        app.router.navigate("login", {trigger: true});
        Backbone.history.start({pushState: true, root: this.basePath});
    }

    
};

app.showLogin = function () {
    if (app.isUserLogged()) {
        app.router.navigate("home", {trigger: true});
        return;
    }
    this.login = new app.view.User.Login();

    $("body").prepend(this.login.el);
};

app.closeLogin = function () {
    this.login.close();
};

app.doLogin = function (user, success, error) {
    $("#login").remove();
    this.login = null;
    app.router.navigate("home",{trigger: true});

    this.user = user;

    $.ajax({
        url: app.config.API_URL + "/users/islogged",

        success: function(usercomplete){
            app.user = usercomplete;
            app.user["password"] = user["password"];
            localStorage.setItem("user",JSON.stringify(app.user));
            if (success){
                success();    
            }
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

app.events.on("menu", function (id) {

});

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

// Tue, 25 Feb 2014 22:32:40 GMT
app.dateFormat = function (dateStr) {
    var date = new Date(dateStr);

    var month = date.getMonth() + 1; //Months are zero based
    var day = date.getUTCDate();
    var year = date.getFullYear();

    if (day < 10)
        day = "0" + day;
    if (month < 10)
        month = "0" + month;
    return day + "/" + month + "/" + year;
};

/* dateStr must be a date in GMT Tue, 25 Feb 2014 22:32:40 GMT*/
app.dateTimeFormat = function (dateStr) {
    var date = new Date(dateStr);

    var month = date.getMonth() + 1; //Months are zero based
    var day = date.getUTCDate();
    var year = date.getFullYear();
    var hours = date.getHours();
    var minutes = date.getMinutes();

    if (month < 10)
        month = "0" + month;
    if (day < 10)
        day = "0" + day;
    if (hours < 10)
        hours = "0" + hours;
    if (minutes < 10)
        minutes = "0" + minutes;

    return day + "/" + month + "/" + year + " - " + hours + ":" + minutes;
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

app.toggleMenu = function () {
    if ($('#menu').hasClass('expandOpen')) {
        $('#menu').removeClass().addClass('expandClose');
    }
    else if ($('#menu').hasClass('expandClose') || typeof $('#menu').attr('class') === 'undefined' ) {
        $('#menu').removeClass().addClass('expandOpen');
    }
};

app.input = function(str){
    str = $.trim(str);
    if (str === "")
        return null;
    return str;
}

app.formatNumber = function (n,decimals){

    if (n===null){
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

app.getDay = function(dateObject){
    var day = dateObject.getDay() - 1;

    if (day == -1)
        day = 6;

    return day;

}