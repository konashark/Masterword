// Window Object
// *****************************************************
var Jgl_Window = function(jgl, params) {
    // params:
    //      parent
    //      xPos
    //      yPos
    //      width
    //      height
    //      canvas
    //      viewport
    //      border
    //      frame
    //      zOrder
    //      backgroundColor
    //      backgroundImage

    var jgl = jgl;  // save parent context
    params.type = 'div';
    if (params.class === undefined) { params.class = 'window'};
    var params = params;
    var elem = jgl.createElement(params);
};

//*****************************************************
Jgl_Window.prototype.hide = function(){
};

//*****************************************************
Jgl_Window.prototype.show = function(){
};

//*****************************************************
Jgl_Window.prototype.move = function(){
};

//*****************************************************
Jgl_Window.prototype.resize = function(){
};

//*****************************************************
Jgl_Window.prototype.getElement = function(){
    return this.elem;
};

//*****************************************************
Jgl_Window.prototype.getCanvas = function(){
    return this.elem;
};

//*****************************************************
Jgl_Window.prototype.getX = function(){
    return this.params.xPos;
};

//*****************************************************
Jgl_Window.prototype.getY = function(){
    return this.params.yPos;
};

//*****************************************************
Jgl_Window.prototype.getParent = function(){
    return this.params.parent;
};

//*****************************************************
Jgl_Window.prototype.getWidth = function(){
    return this.params.width;
};

//*****************************************************
Jgl_Window.prototype.getHeight = function(){
    return this.params.height;
};

