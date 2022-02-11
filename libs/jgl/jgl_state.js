// Router Object
// *****************************************************

var Jgl_Router = function(stateMgr) {

    this.stateMgr = stateMgr;
    this.lastRoute = '';

    function getUrlVars() {
        var vars = {};
        window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
            function(m,key,value) {
                vars[key] = value;
            });
        return vars;
    }

    this.urlVars = getUrlVars();
};

// *****************************************************
Jgl_Router.prototype.getUrlVars = function(varMask) {
    if (varMask) {
        return this.urlVars[varMask];
    } else {
        return this.urlVars;
    }
};

// *****************************************************
Jgl_Router.prototype.init = function(defaultRoute) {
    var router = this;
    var urlRoute = undefined;

    window.onhashchange = function() {
        console.log ("Route changed...");
        var route;
        var urlRoute = location.hash;
        if (urlRoute && urlRoute.length) {
            route = urlRoute;
        } else {
            route = router.defaultRoute;
        }

        doRouteStateTransition(route);
    };

    doRouteStateTransition = function(route) {
        // Look up State object by route and activate that State
        router.stateMgr.stateList.forEach(function(state, index) {
            if (state.route === route || state.route == route.substr(1)) {
                router.stateMgr.transitionTo(state);
            }
        });
    }

    var urlRoute = location.hash;
    if (urlRoute && urlRoute.length) {
        router.routeTo(urlRoute);
        doRouteStateTransition(urlRoute);
    } else {
        console.log("Setting default route to " + defaultRoute);
        router.defaultRoute = defaultRoute;
        router.routeTo(defaultRoute);
    }
};

// *****************************************************
Jgl_Router.prototype.routeTo = function(route) {
    location.hash = route;  // The 'onhashchange' listener will take it from here...
};

// State Manager Object
// *****************************************************
var Jgl_StateManager = function(jgl) {

    this.jgl = jgl;
    this.stateList = [];
    this.currentState = null;
    this.historyStack = [];
    this.MAX_HISTORIES = 16;
    this.router = new Jgl_Router(this);
};

//*****************************************************
var Jgl_State = function(params){
    // params:
    //      eventHandler    - eventHandler for state
    //      enter           - callback function
    //      exit            - callback function

    this.route          = params.route;
    this.id             = params.id;
    this.enter          = params.enter || function() { console.log("'enter' not implemented")};
    this.exit           = params.exit || function() { console.log("'exit' not implemented")};
    this.eventHandler   = params.eventHandler || function() { return false };
};

//*****************************************************
Jgl_StateManager.prototype.newState = function(params){
    if (!(params && params.id)) {
        return this.jgl.error.PARAMETER;
    }

    return this.registerState(new Jgl_State(params));
};

//*****************************************************
Jgl_StateManager.prototype.registerState = function(state){
    this.stateList.push(state);
    return state;
};

//*****************************************************
Jgl_StateManager.prototype.unregisterState = function(state){

    if (typeof state === "string") {
        state = this.findStateById(state);
    }

    if (state){
        var index = this.stateList.indexOf(state);

        if (index) {
            if (state === this.currentState) {
                console.log("Uh oh. Deleting the current state!");
                this.jgl.postEvent(this.jgl.event.STATE_TERMINATE, this.currentState.id);
                this.currentState = null;
            }
            this.stateList.splice(index, 1);
            return state;
        }
    }
    return null;
};

//*****************************************************
Jgl_StateManager.prototype.findStateById = function(id){
    for (var node = 0; node < this.stateList.length; node++) {
        if (this.stateList[node].id === id) {
            return this.stateList[node];
        }
    }
    return null;
};

//*****************************************************
Jgl_StateManager.prototype.getCurrentState = function(){
    return this.currentState.id;
};

//*****************************************************
Jgl_StateManager.prototype.getCurrentStateEventHandler = function(){
    //console.log("currentState = ", this.currentState);
    return this.currentState.eventHandler;
};

//*****************************************************
Jgl_StateManager.prototype.getCurrentStateId = function(){
    return this.currentState.id;
};

//*****************************************************
Jgl_StateManager.prototype.privateDoTransition = function(oldState, newState, stateData){
    // Tell old state that it's going away
    if (oldState && oldState.exit) {
        if (stateData === undefined || stateData === null) {
            stateData = oldState.exit(oldState, newState);    // old state, new state
        } else {
            oldState.exit(oldState, newState);    // old state, new state
        }
    }
    if (this.currentState) {
        this.jgl.postEvent(this.jgl.event.STATE_TERMINATE, this.currentState.id);
    }

    // Tell new state that it's being activated
    if (newState.enter) {
        newState.enter(this.currentState, newState, stateData);
    }

//    if (newState.route) {
//        this.router.setRoute(newState.route);
//    }
    this.currentState = newState;
    console.log("JGL CURRENT STATE: " + newState.id);
    this.jgl.postEvent(this.jgl.event.STATE_ACTIVATE, { id: newState.id, stateData: stateData });
}

//*****************************************************
Jgl_StateManager.prototype.transitionTo = function(state, stateData){
    if (state) {
        if (typeof state === "string") {
            state = this.findStateById(state);
        }

        if (state === this.currentState) {
            console.log("Uh oh. Requested state is already active!");
        }

        this.privateDoTransition(this.currentState, state, stateData);

        this.historyStack.unshift(state);
        if (this.historyStack.length > this.MAX_HISTORIES) {
            this.historyStack.pop();
        }
    }
    return state;
};

//*****************************************************
Jgl_StateManager.prototype.transitionBack = function(){
    var oldState = this.currentState;
    this.historyStack.shift();
    var newState = this.historyStack[0];

    if (oldState && newState) {
        this.privateDoTransition(oldState, newState);
    }
    return this.currentState;
};
