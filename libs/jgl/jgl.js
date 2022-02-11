//*****************************************************
//  The master JGL class
//*****************************************************
var Jgl = function(){
    console.log("JGL INIT");
    this.winList    = [];
    this.mapList    = [];
    this.spriteList = [];
    this.stateList  = [];
    self = this;

    this.KEYS = {
        DELETE:     8,
        TAB:        9,
        ENTER:      13,
        SHIFT:      16,
        CTRL:       17,
        OPTION:     18,
        BACK:       27,
        ESC:        27,
        SPACE:      32,
        LEFT:       37,
        UP:         38,
        RIGHT:      39,
        DOWN:       40,
        N0:         48,
        N1:         49,
        N2:         50,
        N3:         51,
        N4:         52,
        N5:         53,
        N6:         54,
        N7:         55,
        N8:         56,
        N9:         57,
        A:          65,
        B:          66,
        C:          67,
        D:          68,
        E:          69,
        F:          70,
        G:          71,
        H:          72,
        I:          73,
        J:          74,
        K:          75,
        L:          76,
        M:          77,
        N:          78,
        O:          79,
        P:          80,
        Q:          81,
        R:          82,
        S:          83,
        T:          84,
        U:          85,
        V:          86,
        W:          87,
        X:          88,
        Y:          89,
        Z:          90,
        LEFTCMD:    91,
        RIGHTCMD:   93,
        SEMICOL:    186,
        EQUAL:      187,
        COMMA:      188,
        DASH:       189,
        PERIOD:     190,
        FORWARD_SLASH:  191,
        LEFT_APOST:     192,
        LEFT_SQUARE:    219,
        BACK_SLASH:     220,
        RIGHT_SQUARE:   221,
        APOSTROPHE:     222
    };

    this.KEY_STATE = [];
    document.addEventListener("keydown", function (ev) {
        //console.log("KEY: ", ev.keyCode);
        self.KEY_STATE[ev.keyCode] = true;
    });
    document.addEventListener("keyup", function (ev) {
        self.KEY_STATE[ev.keyCode] = false;
    });
};

Jgl.prototype.className = "jglGameLibrary";
Jgl.prototype.version = "1.0";

Jgl.prototype.error = {
    NOT_INITIALIZED:    "not_initialized_error",
    PARAMETER:          "parameter_error",
    INVALID_ID:         "invalid_id",
    INVALID_CONTEXT:    "invalid_context",
    ALREADY_ACTIVE:     "already_active"
};

Jgl.prototype.event = {
    JGL_INITIALIZED:    "jgl_initialized",
    STATE_ACTIVATE:     "state_activate",
    STATE_TERMINATE:    "state_terminate"
};

var CONVERT_TO_RADIAN = Math.PI/180;

//*****************************************************
// Utility function to create basic, empty DOM elements on demand
// *****************************************************
window.requestAnimFrame = (function(callback){
    return  window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(callback){
            window.setTimeout(callback, 1000 / 60);
        };
})();

//*****************************************************
//  STATE MANAGER - jgl_state.js
//*****************************************************
Jgl.prototype.newStateManager = function(){
    var stateManager = new Jgl_StateManager(this);
    this.stateList.push(stateManager);
    return stateManager;
};

//*****************************************************
//  WINDOW - jgl_window.js
//*****************************************************
Jgl.prototype.newWindow = function(params){
    var window = new Jgl_Window(this, params);
    this.winList.push(window);
    return window;
};

//*****************************************************
//  TILEMAP - jgl_tilemap.js
//*****************************************************
Jgl.prototype.newTileMap = function(params){
    var tileMap = new Jgl_TileMap(this, params);
    this.mapList.push(tileMap);
    return tileMap;
};

Jgl.prototype.newTileMapCanvas = function(params){
    var tileMap = new Jgl_TileMapCanvas(this, params);
    this.mapList.push(tileMap);
    return tileMap;
};

//*****************************************************
//  SPRITE - jgl_sprite.js
//*****************************************************
Jgl.prototype.newSpriteList = function(){
    var spriteList = new Jgl_SpriteList(this);
    this.spriteList.push(spriteList);
    return spriteList;
};

//*****************************************************
//  GENERAL UTILITY FUNCTIONS
//*****************************************************
Jgl.prototype.createElement = function(params) {
    if (!params){
        console.log("JGL: No parameters!");
    }
    if (!params.type) {
        params.type = 'div';
    }
    var elem = document.createElement(params.type);
    if (!params.position) {
        elem.style.position = 'absolute';
    } else {
        elem.style.position = params.position;
    }
    if (params.class){
        elem.className = params.class;
    }
    if (params.id){
        elem.id = params.id;
    }
    if (params.src){
        elem.setAttribute("src", params.src);
    }
    if (params.top){
        elem.style.top = params.top;
    }
    if (params.left){
        elem.style.left = params.left;
    }
    if (params.width){
        elem.style.width = params.width;
        if (params.type && params.type === 'canvas') {
            elem.width = params.width;
        }
    }
    if (params.height){
        elem.style.height = params.height;
        if (params.type && params.type === 'canvas') {
            elem.height = params.height;
        }
    }
    if (params.text){
        elem.innerHTML = params.text;
    }
    if (params.parent){
        if (typeof params.parent === "string") {
            params.parent = document.getElementById(params.parent);
        }

        params.parent.appendChild(elem);
    }

    return elem;
};

//*****************************************************
Jgl.prototype.random = function(max){
    return Math.floor(Math.random() * max);
};

//*****************************************************
Jgl.prototype.randomRange = function(min, max){
    var range = max - min + 1;
    return (Math.floor(Math.random() * range) + min);
};

//*********************************************************
Jgl.prototype.oneInChance = function(chance) {
    if (0 == Math.floor(Math.random() * (chance)))
        return true;
    return false;
};

Jgl.prototype.DEGREE_TO_RADIAN = 180/Math.PI;
//*********************************************************
Jgl.prototype.distance = function(x1, y1, x2, y2) {
    var dx = x2 - x1;
    var dy = y1 - y2;
    return (Math.sqrt((dx * dx) + (dy * dy)));
};

//*********************************************************
Jgl.prototype.rectToPolar = function(x1, y1, x2, y2) {
    var dx = x2 - x1;
    var dy = y1 - y2;
    var dist = (Math.sqrt((dx * dx) + (dy * dy)));
    var angle = Math.round(Math.atan2(Math.abs(dy),Math.abs(dx)) * 180/Math.PI);

    if (dy >= 0) {
        angle = (dx < 0) ? 270+angle : 90-angle;
    } else {
        angle = (dx < 0) ? 270-angle : 90+angle;
    }

    return {angle:angle, distance:dist};
};

//*********************************************************
Jgl.prototype.rgbString = function(r, g, b) {
    return 'rgb(' + r + ',' + g + ',' + b + ')';
};

//*****************************************************
// Converts image to canvas; returns new canvas element
Jgl.prototype.convertImageToCanvas = function(image) {
    var canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    canvas.getContext("2d").drawImage(image, 0, 0);

    return canvas;
};

//*****************************************************
// Converts canvas to an image
Jgl.prototype.convertCanvasToImage = function(canvas) {
    var image = new Image();
    image.src = canvas.toDataURL("image/png");
    return image;
}

//*****************************************************
Jgl.prototype.newImage = function(src, callback){
    var image = new Image();
    if (callback){
        image.onload = function() { callback(image);};
    }
    image.src = src;
    return image;
};

//*****************************************************
Jgl.prototype.drawImage = function(context, image, x, y, params){

    if (!params) {
        context.drawImage(image, x, y);
        return;
    }

    // Params:
    //  scale: float
    //  scaleX: float
    //  scaleY: float
    //  center: boolean
    //  rotation: float
    //  opacity: float

    var width = image.width;
    var height = image.height;

    if (params.scale) {
        width = width * params.scale;
        height = height * params.scale;
    } else {
        if (params.scaleX) {
            width = width * params.scaleX;
        }

        if (params.scaleY) {
            height = height * params.scaleY;
        }
    }

    if (params.center) {
        x = x - parseInt(width / 2);
        y = y - parseInt(height / 2);
    }

    context.save();

    if (params.hasOwnProperty('rotation')) {
        if (params.center){
            context.translate(x + parseInt(width / 2), y + parseInt(height / 2));
            x = - parseInt(width / 2);
            y = - parseInt(height / 2);
        } else {
            context.translate(x, y);
            x = y = 0;
        }
        context.rotate(params.rotation * CONVERT_TO_RADIAN);
    }

    if (params.hasOwnProperty('opacity')) {
        context.globalAlpha = params.opacity;
    }

    context.drawImage(
        image,
        0, 0, image.width, image.height,
        x, y, width, height
    );

    context.restore();
};

//*****************************************************
Jgl.prototype.slowType = function(elem, str, speed, callback){
    var len = str.length;
    var i = 0;
    elem.innerHTML = "";

    function printChar(){
        var ch = str.charAt(i);
        if (ch == '~') { ch = '<br>'}
        elem.innerHTML += ch;
        if (++i <= len){
            setTimeout(printChar, speed);
        } else {
            if (callback) {
                callback();
            }
        }
    }

    printChar();
};

// **********************************************************
// document.addEventListener(type, function(event) { data is in event.detail.data); });
Jgl.prototype.postEvent = function(type, data) {
    var event = new CustomEvent(type, { detail: { data: data }} );
    event.preventDefault();
    document.dispatchEvent(event);
};

// **********************************************************
Jgl.prototype.centerElement = function(elem, orientation) {
    var parent;

    if (typeof elem === "string"){
        elem = document.getElementById(elem);
    }

    if (orientation === undefined || orientation === 'horizontal' || orientation === 'both') {
        parent = elem.parentNode;
        if (parent){
            elem.style.left = Math.floor((parent.clientWidth - elem.clientWidth) / 2) + 'px';
        }
    }

    if (orientation === 'vertical' || orientation === 'both') {
        parent = elem.parentNode;
        if (parent){
            elem.style.top = Math.floor((parent.clientHeight - elem.clientHeight) / 2) + 'px';
        }
    }
};

// **********************************************************
Jgl.prototype.loadJs = function(filename){
    document.write("<script src='" + filename + "'></script>");
};

// **********************************************************
Jgl.prototype.loadCss = function(filename, id) {
    var fileref;
    fileref = document.createElement("link");
    fileref.setAttribute("rel", "stylesheet");
    fileref.setAttribute("type", "text/css");
    fileref.setAttribute("href", filename);
    if (id) {
        fileref.setAttribute("id", id);
    }
    document.querySelector("head").appendChild(fileref);
    return fileref;
};
