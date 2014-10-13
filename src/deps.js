var deps = {};

deps.templateFolder = "js/template";
deps.JS = {
	ThirdParty:{
		src: [
			"js/lib/jquery-2.0.3.min.js",
			"js/lib/underscore-min.js",
			"js/lib/backbone-min.js",
			"js/lib/date-utils.min.js",
			"js/lib/sprintf.min.js"
			// "js/lib/validator.min.js"
		],
		desc: "Third party library"
	}
	,Core: {
		src: [
			// Namespace
			"js/namespace.js",
			// Config file
			"js/config.js",

			"js/validator.js",

			"js/md5.js",

			// ---------------------
			// -------  Models -----
			// ---------------------
			"js/model/user_model.js",
			"js/model/project_model.js",
			"js/model/time_model.js",

			// ---------------------
			// ---  Collections  ---
			// ---------------------
			"js/collection/user/list_user_collection.js",
			"js/collection/user/user_projects_collection.js",
			"js/collection/user/timesheet_collection.js",
			"js/collection/project/list_project_collection.js",

			
			// ---------------------
			// ------  Views -------
			// ---------------------
			"js/view/error_view.js",
			"js/view/notfound_view.js",
			"js/view/home_view.js",
			"js/view/section_header_view.js",
			// Projects
			"js/view/project/project_form_view.js",
            "js/view/project/project_overview_view.js",
            "js/view/project/project_list_view.js",
            "js/view/project/project_detail_view.js",
            // User
			"js/view/user/login_view.js",	
            "js/view/user/menu_view.js",	
			"js/view/user/login_view.js",
			"js/view/user/timesheet_view.js",	
			"js/view/user/timesheet_addtime_view.js",
			"js/view/user/week_view.js",	
			// router
			"js/router.js",

			// // app
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
            "css/menu.css",
            "css/animations.css",
            "css/timeSheet.css",
		]
	}
};

if (typeof exports !== 'undefined') {
	exports.deps = deps;
}
