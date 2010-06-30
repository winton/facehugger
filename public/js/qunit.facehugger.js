$(function() {
	
	// Utility functions
	
	function initFB() {
		$.fb.init({ appId: window.app_id, status: true });
	}
	
	function loginFB(fn) {
		logoutFB(function() {
			$.fb.login(fn);
		});
	}
	
	function logoutFB(fn) {
		$.fb.waitForInit(function() {
			if (FB.getSession())
				$.fb.logout(function() {
					resetFB(fn);
				});
			else
				fn();
		});
	}
	
	function removeFB() {
		$('#fb-root').remove();
		window.FB = null;
	}
	
	function resetFB(fn) {
		removeFB();
		initFB();
		$.fb.waitForInit(function() {
			fn();
		});
	}
	
	// Tests
	
	module('init');
	
	test('should initialize', function() {
		expect(1);
		stop();
		resetFB(function() {
			start();
			ok(true);
		});
	});
	
	module('waitForInit');
	
	test('should call waitForInit even after initialized', function() {
		expect(1);
		stop();
		resetFB(function() {
			$.fb.waitForInit(function() {
				start();
				ok(true);
			});
		});
	});
	
	module('login');
	
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
	
	module('logout');
	
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
	
	module('status');
	
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
});