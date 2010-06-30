jQuery.fb = new function() {
	
	var $ = jQuery;
	var events = $('<div/>');
	var fb_root;
	var init_options;
	var me = this;
	var protocol = document.location.protocol;
	
	$.extend(this, {
		bind: bind,
		init: init,
		login: login,
		logout: logout,
		one: one,
		status: status,
		waitForInit: waitForInit
	});
	
	window.fbAsyncInit = function() {
		FB.init(init_options);
		
		fbEventSubscribe('auth.statusChange', function(response) {
			events.trigger('status_' + response.status, response);
		});
		
		events.trigger('init');
	};
	
	function bind(e, fn) {
		events.bind(e, fn);
		return me;
	}
	
	function fbEventSubscribe(e, fn) {
		waitForInit(function() {
			FB.Event.subscribe(e, fn);
		});
	}
	
	function fbGetLoginStatus(fn) {
		waitForInit(function() {
			FB.getLoginStatus(fn);
		});
	}
	
	function fbLogin(fn, options) {
		waitForInit(function() {
			console.log(options);
			FB.login(fn, options);
		});
	}
	
	function fbLogout(fn) {
		waitForInit(function() {
			FB.logout(fn);
		});
	}
	
	function init(options) {
		fb_root = $('#fb-root');
		init_options = options;
		
		if (!fb_root.length)
			fb_root = $('<div id="fb-root"/>').appendTo('body');
		
		$('<script/>')
			.attr({
				async: true,
				src: protocol + '//connect.facebook.net/en_US/all.js'
			})
			.appendTo(fb_root);
		
		return me;
	}
	
	function login() {
		var args = $.makeArray(arguments);
		var fn;
		
		if (typeof args[args.length-1] == 'function')
			fn = args.pop();
		
		if (typeof args[0] == 'object')
			args = $.makeArray(args[0]);
		
		fbLogin(fn, { perms: args.join(',') });
		
		return me;
	}
	
	function logout(fn) {
		fbLogout(fn);
		return me;
	}
	
	function one(e, fn) {
		events.one(e, fn);
	}
	
	function status(type, fn) {
		if (type && fn)
			return bind('status_' + type, fn);
		
		else if (type) {
			fn = type;
			type = null;
		}
		
		fbGetLoginStatus(fn);
		
		return me;
	}
	
	function waitForInit(fn) {
		if (window.FB)
			fn();
		else
			events.one('init', fn);
		
		return me;
	}
};