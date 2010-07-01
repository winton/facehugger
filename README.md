Facehugger
===========

Wraps the Facebook Javascript SDK in a warm, loving, jQuery-ish embrace.

Download
--------

[jquery.facehugger.js](https://github.com/winton/facehugger/raw/master/public/js/jquery.facehugger.js)

Usage
-----

<pre>
// Init

$.fb.init({ app_id: 'YOUR APP ID', status: true }, function() {
  
  // Status

  $.fb.status(function(response) {
    console.log(response);
  });

  $.fb.status('connected', function() { console.log('connected'); });
  $.fb.status('not_connected', function() { console.log('not connected'); });
  $.fb.status('unknown', function() { console.log('unknown'); });

  $.fb.status();

  // Login
  
  $.fb.login('publish_stream', function() {
    
    // API
    
    $.fb.api('/me', function(response) {
      console.log(response);
    });
    
    // Cached API
    
    $.fb.api('my_cookie', '/me', function(response) {
      console.log(response);
    });
    
    // Logout
    
    $.fb.logout(function() {
      console.log('logged out');
    });
  });
});
</pre>