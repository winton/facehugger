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
  
  $.fb
  
    // Status

    .status(function(response) {
      console.log(response);
    })

    .status('connected', function() { console.log('connected'); })
    .status('not_connected', function() { console.log('not connected'); })
    .status('unknown', function() { console.log('unknown'); })

    .status()

    // Login
  
    .login('publish_stream', function() {
      
      $.fb
    
        // API
    
        .api('/me', function(response) {
          console.log(response);
        })
    
        // Cached API
    
        .cachedAPI('/me', [ 'id', 'name' ], function(response) {
          console.log(response);
        })
    
        // Logout
    
        .logout(function() {
          console.log('logged out');
        });
    });
});
</pre>