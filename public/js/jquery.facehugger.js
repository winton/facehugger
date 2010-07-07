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
		unbind: unbind
	});
	
	bindPrivateEvents();
	
	window.fbAsyncInit = function() {
		FB.init(init_options);
		private_events.trigger('init');
	};
	
	function api() {
		login(function() {
			fbAPI.apply(this, compressArgs(arguments));
		});
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
		else {
			var args = compressArgs([ path, method, data, fn ]);
			
			if (typeof args[args.length-1] == 'function')
				fn = args[args.length-1];
			
			var replacement_fn = function(response) {
				cookie(key, toJson(response));
				if (fn) fn(response);
			};
			
			if (fn)
				args[args.length-1] = replacement_fn;
			else
				args.push(replacement_fn);
			
			api.apply(this, args);
		}
		
		return me;
	}
	
	function compressArgs(args) {
		args = $.makeArray(args);
		
		return $.grep(args, function(item) {
			return (item != undefined);
		});
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
					var cookie = $.trim(cookies[i]);
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
		init(function() {
			FB.api(path, method, data, fn);
		});
	}
	
	function fbEventSubscribe(e, fn) {
		init(function() {
			FB.Event.subscribe(e, fn);
		});
	}
	
	function fbGetLoginStatus(fn) {
		init(function() {
			FB.getLoginStatus(fn);
		});
	}
	
	function fbLogin(fn, options) {
		init(function() {
			FB.login(fn, options);
		});
	}
	
	function fbLogout(fn) {
		init(function() {
			FB.logout(fn);
		});
	}
	
	function fromJson(json) {
		return eval('(' + (json || '{}') + ')');
	}
	
	function init(options, fn) {
		if (typeof options == 'function') {
			fn = options;
			options = null;
		}
			
		if (options) {
			options.appId = options.app_id || options.appId;
			delete options.app_id;

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
		}
		
		if (fn) {
			if (window.FB)
				fn();
			else
				private_events.one('init', fn);
		}
		
		return me;
	}
	
	function login() {
		var args = $.makeArray(arguments);
		var fn;
		var options;
		
		if (typeof args[args.length-1] == 'function')
			fn = args.pop();
		
		if (typeof args[0] == 'object')
			options = args[0];
		
		else if (typeof args[0] == 'string')
			options = { perms: args.join(',') };
		
		fbLogin(function(response) {
			events.trigger('login');
			if (fn) fn(response);
		}, options);
		
		return me;
	}
	
	function logout(fn) {
		fbLogout(function(response) {
			events.trigger('logout');
			if (fn) fn(response);
		});
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
		
		else if (typeof type == 'function') {
			fn = type;
			type = null;
		}
		
		fbGetLoginStatus(function(response) {
			if (response.status == 'notConnected')
				response.status = 'not_connected';
			if (fn) fn(response);
		});
		
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
	
	function unbind(eventType, handler) {
		events.unbind(eventType, handler);
		return me;
	}
};