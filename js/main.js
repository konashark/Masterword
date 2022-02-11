/*
 *  MASTERWORD
 *  V1.0 Feb 10, 2022
 *  Copyright (c) 2022 Jeffrey Sprague
 */

var jgl;
var stateManager;

// ********************************************
window.onload = function() {

    jgl = new Jgl; // Instantiate JGL. Do this once at the start of your program

    // Create the state machine and initialise it to a given state
    stateManager = jgl.newStateManager();

    // Register our two states (defined in their own, name-corresponding files)
    stateManager.registerState(SPLASH);
    stateManager.registerState(GAME);

    // You can either switch focus at the State level or the Router level, but you should not mix both ways of doing it.
    stateManager.router.init('routeSplash');    // This will use the route in the URL if present, otherwise it uses the route passed in

    // Start handling key events
    document.onkeydown = function(event) {
        var eventConsumed = false;
        event.preventDefault();

        // First, see if the current state object is interested in this event
        var eventHandler = stateManager.getCurrentStateEventHandler();
        if (eventHandler) {
            eventConsumed = eventHandler(event);
        }

        // If the current state object didn't use the event, perhaps we, the main app wrapper will use it
        if (!eventConsumed) {
            //console.log("Event was not handled by any State");
        }

    }.bind(this);
};
