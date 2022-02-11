//*****************************************************
var Jgl_TileMap = function(jgl, params){
    this.jgl = jgl;
    this.tiles = []
    this.map = [];
    this.tilesWide = undefined;
    this.tilesTall = undefined;
    this.tileWidth = undefined;
    this.tileHeight = undefined;
    this.width = undefined;
    this.height = undefined;
    this.offsetX = 0;
    this.offsetY = 0;
    this.viewPort = undefined;
    this.surface = undefined;
};

//*****************************************************
Jgl_TileMap.prototype.newTile = function(id, url) {
    var tile = {};
    tile.elem = this.jgl.createElement({
        type: 'img',
        src: url
    });
    this.tiles[id] = tile;
};

//*****************************************************
Jgl_TileMap.prototype.defineMap = function(params) {
    /* Params:
     map: array
     tilesWide: int
     tilesTall: int
     tileWidth: int
     tileHeight: int
     parentElem: dom element
     viewPortX: int
     viewPortY: int
     viewPortWidth: int
     viewPortHeight: int
     */

    this.map = params.map;
    this.tilesWide = params.tilesWide;
    this.tilesTall = params.tilesTall;
    this.tileWidth = params.tileWidth;
    this.tileHeight = params.tileHeight;

    this.viewPort = this.jgl.createElement ({
        parent: params.parentElem,
        type: 'div',
        left: params.viewPortX,
        top: params.viewPortY,
        width: params.viewPortWidth,
        height: params.viewPortHeight
    });

    this.surface = this.jgl.createElement ({
        parent: this.viewPort,
        type: 'div'
    });

    this.width = params.tilesWide * this.tileWidth;
    this.height = this.tileHeight * params.tileHeight;

    var r, c, tileId, tileNode;

    // Populate surface element with tiles
    for (r = 0; r < this.tilesTall; r++){
        for (c = 0; c < this.tilesWide; c++){
            tileId = this.map[r][c];
            tileNode = this.tiles[tileId].elem.cloneNode();
            tileNode.style.top = (r * this.tileHeight) + 'px';
            tileNode.style.left = (c * this.tileWidth) + 'px';
            this.surface.appendChild(tileNode);
        }
    }

};

//*****************************************************
Jgl_TileMap.prototype.draw = function(params) {
    /* Params:
     x: int
     y: int
     */
    this.offsetX = params.x;
    this.offsetY = params.y;
    this.surface.style.left = params.x + 'px';
    this.surface.style.top = params.y + 'px';
};
