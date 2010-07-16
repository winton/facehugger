$(function() {
	
	// Utility functions
	
	function loginFB(fn) {
		logoutFB(function() {
			$.fb.login(fn);
		});
	}
	
	function logoutFB(fn) {
		if (window.FB && FB.getSession())
			$.fb.logout(function() {
				resetFB(fn);
			});
		else
			resetFB(fn);
	}
	
	function resetFB(fn) {
		$.fb
			.reset()
			.init({ app_id: window.app_id, status: true }, fn);
	}
	
	function wait(msg, fn) {
		var alert = $('<div id="alert"/>')
			.html(msg + " ")
			.css({
				background: 'red',
				color: 'white',
				'font-family': $('h1').css('font-family'),
				'font-weight': 'bold',
				'margin-bottom': '8px',
				padding: '8px'
			})
			.prependTo('body');
		alert.append(
			$('<a href="#"/>')
				.html('Continue')
				.css('color', 'yellow')
				.click(function() {
					alert.remove();
					fn();
					return false;
				})
		);
	}
	
	// Tests
	
	module('init', { setup: $.fb.unbind });
	
	test('should initialize', function() {
		expect(1);
		stop();
		resetFB(function() {
			start();
			ok(true);
		});
	});
	
	module('init event', { setup: $.fb.unbind });
	
	test('should call init event even after initialized', function() {
		expect(1);
		stop();
		resetFB(function() {
			$.fb.init(function() {
				start();
				ok(true);
			});
		});
	});
	
	module('login', { setup: $.fb.unbind });
	
	test('should log the user in', function() {
		expect(1);
		stop();
		loginFB(function() {
			start();
			ok(true);
		});
	});
	
	test('should log the user in with permissions', function() {
		expect(1);
		stop();
		logoutFB(function() {
			$.fb.login('publish_stream', 'email', function() {
				start();
				ok(true);
			});
		});
	});
	
	module('logout', { setup: $.fb.unbind });
	
	test('should log the user out', function() {
		expect(1);
		stop();
		loginFB(function() {
			$.fb.logout(function() {
				start();
				ok(true);
			});
		});
	});
	
	module('status without event', { setup: $.fb.unbind });
	
	test('should get the status', function() {
		expect(1);
		stop();
		loginFB(function() {
			$.fb.status(function(response) {
				start();
				equals(response.status, 'connected');
			});
		});
	});
	
	module('status with event', { setup: $.fb.unbind });
	
	test('should trigger the not_connected event', function() {
		expect(1);
		stop();
		wait('Remove the dev app from your Facebook account now.', function() {
			$.fb.status('not_connected', function(response) {
				start();
				ok(true);
			});
			resetFB(function() {
				$.fb.status();
			});
		});
	});
	
	test('should trigger the connected event', function() {
		expect(1);
		stop();
		$.fb.status('connected', function() {
			start();
			ok(true);
		});
		loginFB();
	});
	
	test('should trigger the unknown event', function() {
		expect(1);
		stop();
		$.fb.status('unknown', function(response) {
			start();
			ok(true);
		});
		logoutFB(function() {
			$.fb.status();
		});
	});
	
	module('api', { setup: $.fb.unbind });
	
	test('should query "/me" and respond with id and name', function() {
		expect(2);
		stop();
		loginFB(function() {
			$.fb.api('/me', function(response) {
				start();
				equals(typeof response.id, 'string');
				equals(typeof response.name, 'string');
			});
		});
	});
	
	module('api post', { setup: $.fb.unbind });
	
	test('should post a feed item', function() {
		expect(1);
		stop();
		wait("This test will post a feed item to your account.", function() {
			logoutFB(function() {
				$.fb.login('publish_stream', function() {
					var data = {
						message: 'Message',
						picture: 'http://blog.wintoni.us/images/winton.png',
						link: 'http://wintoni.us',
						name: 'Name',
						caption: 'Caption',
						description: 'Description'
					};
					$.fb.api('/me/feed', 'post', data, function(response) {
						start();
						equals(typeof response.id, 'string');
					});
				});
			});
		});
	});
	
	module('api post via REST', { setup: $.fb.unbind });
	
	test('should post a feed item', function() {
		expect(1);
		stop();
		wait("This test will post a feed item to your account.", function() {
			logoutFB(function() {
				$.fb.login('publish_stream', function() {
					var params = {
						method: 'stream.publish',
						message: 'Message',
						action_links: [
							{
								text: 'Action link',
								href: 'http://wintoni.us'
							}
						],
						attachment: {
							name: 'Attachment name',
							href: 'http://wintoni.us',
							caption: 'Attachment caption',
							description: 'Attachment description',
							properties: {
								'Attachment property': {
									href: 'http://wintoni.us',
									text: 'Attachment property text'
								}
							},
							media: [
								{
									type: 'image',
									src: 'http://blog.wintoni.us/images/winton.png',
									href: 'http://wintoni.us'
								}
							]
						}
					};
					$.fb.api(params, function(response) {
						start();
						equals(typeof response, 'string');
					});
				});
			});
		});
	});
	
	module('cached API', {
		setup: function() {
			$.fb.cookie('fb_me', null);
			$.fb.unbind();
		},
		teardown: function() {
			$.fb.cookie('fb_me', null);
		}
	});
	
	test('should cache "/me"', function() {
		expect(4);
		stop();
		loginFB(function() {
			$.fb.cachedAPI('/me', [ 'id', 'name' ], function(response) {
				start();
				equals(typeof response.id, 'string');
				equals(typeof response.name, 'string');
				
				var cached = $.fb.cachedAPI('/me');
				equals(typeof cached.id, 'string');
				equals(typeof cached.name, 'string');
			});
		});
	});
});