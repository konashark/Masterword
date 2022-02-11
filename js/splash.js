var SPLASH = {};   // Create a placeholder for our new State module

// This STATE CLASS really doesn't do anything right now except activate an HTML backdrop screen and process
// the ENTER key which is used to transition to the GAME state. This could do fancier stuff in the future.

(function() {
    var log  = function(str) { console.log(this.id + ': ' + str);}.bind(this);

    this.id = 'SPLASH';
    this.route = 'routeSplash';
    this.flags = {
        asyncExit: true
    };

    log('Loaded');

    // ********************************************
    this.init = function (params) {
        log('Initializing ' + this.id);
    };

    // ********************************************
    this.enter = function (currentState, userData) {
        log('Entering ' + this.id);

        // Activate our screen
        var elem = document.getElementById(this.id);
        elem.classList.add('show');
    };

    // ********************************************
    this.exit = function (callback) {
        log('Exiting ' + this.id);

        // Deactivate our screen
        var elem = document.getElementById(this.id);
        elem.classList.remove('show');
    };

    // ********************************************
    this.eventHandler = function (event) {

        if (!event.keyCode) {
            return;
        }

        var consumed = false;

        // Events are forwarded to us from the main start-up code.
        // We must reply whether we used the event or not.

        switch (event.keyCode) {
            case jgl.KEYS.ENTER:
                stateManager.router.routeTo('routeGame');
                consumed = true;
        }

        return consumed;
    };

}).apply(SPLASH);  // Apply this object to the State placeholder we defined
