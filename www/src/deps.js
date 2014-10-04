var deps = {};

deps.templateFolder = "js/template";
deps.JS = {
	ThirdParty:{
		src: [
			"js/lib/jquery-2.0.3.min.js",
			"js/lib/underscore-min.js",
			"js/lib/backbone-min.js",
		],
		desc: "Third party library"
	}
	,Core: {
		src: [
			// Namespace
			"js/namespace.js",
			// Config file
			"js/config.js",

			"js/md5.js",	
			
			// --------------------
			// ------  Views ------
			// --------------------
			"js/view/error_view.js",
			"js/view/notfound_view.js",
			"js/view/home_view.js",
            "js/view/project/project_overview_view.js",
            "js/view/section_header_view.js",
			"js/view/user/login_view.js",
			"js/view/user/time_sheet_view.js",			
			// router
			"js/router.js",
			// app
			"js/app.js",
		],
		desc: "Core library."
	}
};

deps.CSS = {
	ThirdParty:{
		src : [
			
		]
	},
	Core: {
		src: [
			"css/lib/WWW-Styles/reset.css",
			"css/lib/WWW-Styles/base.css",
			"css/styles.css",
			"css/home.css",
            "css/animations.css",
            "css/timeSheet.css",
		]
	}
};

if (typeof exports !== 'undefined') {
	exports.deps = deps;
}
