jQuery.fb = new function() {
	
	var $ = jQuery;
	var events = $('<div/>');
	var fb_root;
	var init_options;
	var me = this;
	var private_events = $('<div/>');
	var protocol = document.location.protocol;
	var url = "graph.facebook.com";
	
	$.extend(this, {
		api: api,
		bind: bind,
		cachedAPI: cachedAPI,
		cookie: cookie,
		fromJson: fromJson,
		init: init,
		login: login,
		logout: logout,
		one: one,
		reset: reset,
		status: status,
		toJson: toJson,
		unbind: unbind,
		waitForInit: waitForInit
	});
	
	bindPrivateEvents();
	
	window.fbAsyncInit = function() {
		FB.init(init_options);
		private_events.trigger('init');
	};
	
	function api(path, method, data, fn) {
		if (!data) 
			fbAPI(path, method);
		else if (!fn)
			fbAPI(path, method, data);
		else
			fbAPI(path, method, data, fn);
		
		return me;
	}
	
	function bind(e, fn) {
		events.bind(e, fn);
		return me;
	}
	
	function bindPrivateEvents() {
		private_events
			.unbind()
			.one('init', function() {
				fbEventSubscribe('auth.statusChange', function(response) {
					if (response.status == 'notConnected')
						response.status = 'not_connected';
					events.trigger('status_' + response.status, response);
				});
			});
	}
	
	function cachedAPI(key, path, method, data, fn) {
		if (path == undefined)
			return fromJson(cookie(key));
		else
			api(path, method, data, function(response) {
				cookie(key, toJson(response));
				fn(response);
			});
		
		return me;
	}
	
	function cookie(name, value) {
		if (!name) return null;
		if (typeof value != 'undefined') {
			if (value === null)
				document.cookie = [
					name, '=', '; expires=-1; path=/'
				].join('');
			else
				document.cookie = [
					name, '=', encodeURIComponent(value), '; path=/'
				].join('');
		} else {
			var cookie_value = null;
			if (document.cookie && document.cookie != '') {
				var cookies = document.cookie.split(';');
				for (var i = 0; i < cookies.length; i++) {
					var cookie = trim(cookies[i]);
					if (cookie.substring(0, name.length + 1) == (name + '=')) {
						cookie_value = decodeURIComponent(
							cookie.substring(name.length + 1)
						);
						break;
					}
				}
			}
			return cookie_value;
		}
		return null;
	}
	
	function fbAPI(path, method, data, fn) {
		waitForInit(function() {
			FB.api(path, method, data, fn);
		});
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
			FB.login(fn, options);
		});
	}
	
	function fbLogout(fn) {
		waitForInit(function() {
			FB.logout(fn);
		});
	}
	
	function fromJson(json) {
		return eval('(' + (json || '{}') + ')');
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
	
	function picture(id, type) {
		if (type) // square, small, large
			type = '?type=' + type;
		else
			type = '';
		return protocol + "://" + url + "/" + id + "/picture" + type;
	}
	
	function reset() {
		$('#fb-root').remove();
		delete window.FB;
		bindPrivateEvents();
		return me;
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
	
	function toJson(obj) {
		var json = [];
		if (obj.constructor == Object) {
			json.push('{');
			for (var name in obj) {
				json.push('"' + name + '"');
				json.push(':');
				json.push(toJson(obj[name]));
				json.push(',');
			}
			if (json[json.length - 1] == ',')
				json.pop();
			json.push('}');
		} else if (obj.constructor == Array) {
			json.push('[');
			for(var i = 0, l = obj.length; i < l; i++) {
				json.push(toJson(obj[i]));
				json.push(',');
			}
			if (json[json.length - 1] == ',')
				json.pop();
			json.push(']');
		} else if (typeof obj == 'string')
			json.push('"' + obj + '"');
		else if (typeof obj == 'number')
			json.push(obj);
		else
			json.push(obj + '');
		return json.join('');
	}
	
	function trim(text) {
		return (text || "")
			.replace(/^(\s|\u00A0)+|(\s|\u00A0)+$/g, "");
	}
	
	function unbind(eventType, handler) {
		events.unbind(eventType, handler);
		return me;
	}
	
	function waitForInit(fn) {
		if (window.FB)
			fn();
		else
			private_events.one('init', fn);
		
		return me;
	}
};