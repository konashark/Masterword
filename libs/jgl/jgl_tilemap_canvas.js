var Jgl_TileMapCanvas = function(jgl, params){
    this.jgl = jgl;
    this.signature = "tilemapcanvas";
    this.tileMap = {
        ready: false,
        context: null,
        dispX: 0,
        dispY: 0,
        dispWidthPx: 0,
        dispHeightPx: 0,
        bufCanvas: null,
        bufContext: null,
        bufWidthPx: 0,
        bufHeightPx: 0,
        bufNumColumns: 0,
        bufNumRows: 0,
        posX: 0,
        posY: 0,
        posOffsetX: 0,
        posOffsetY: 0,
        cornerstoneTileX: undefined,
        cornerstoneTileY: undefined
    };
    this.mapData = {
        defaultTile: null,
        numColumns: 0,
        numRows: 0,
        tileWidth: 32,
        tileHeight: 32,
        mapWidthPx: 0,
        mapHeightPx: 0,
        mapData: [],
        tiles: []
    };

    this.tileMap.context = params.context;
    this.tileMap.dispX = params.x;
    this.tileMap.dispY = params.y;
    this.tileMap.dispWidthPx = params.w;
    this.tileMap.dispHeightPx = params.h;
};

//*****************************************************
Jgl_TileMapCanvas.prototype.newTile = function(params) {
	this.mapData.tiles[params.index] = params;
}

//*****************************************************
Jgl_TileMapCanvas.prototype.attachMap = function(params) {
	this.mapData.numColumns = params.numColumns;
	this.mapData.numRows = params.numRows;
	this.mapData.tileWidth = params.tileWidth;
	this.mapData.tileHeight = params.tileHeight;
	this.mapData.mapData = params.mapData;
	this.mapData.mapWidthPx = params.numColumns * params.tileWidth;
	this.mapData.mapHeightPx = params.numRows * params.tileHeight;
	
	this.tileMap.bufTilesWide = ~~(this.tileMap.dispWidthPx / params.tileWidth) + 3;
	this.tileMap.bufTilesTall = ~~(this.tileMap.dispHeightPx / params.tileHeight) + 3;
	this.tileMap.bufWidthPx = this.tileMap.bufTilesWide * params.tileWidth;
	this.tileMap.bufHeightPx = this.tileMap.bufTilesTall * params.tileHeight;
	
	this.tileMap.bufCanvas = document.createElement('canvas');
	this.tileMap.bufCanvas.width = this.tileMap.bufWidthPx;
	this.tileMap.bufCanvas.height = this.tileMap.bufHeightPx;
	this.tileMap.bufContext = this.tileMap.bufCanvas.getContext('2d');
}

//*****************************************************
Jgl_TileMapCanvas.prototype.setDefaultTile = function(tile) {
    this.mapData.defaultTile = tile;
}

//*****************************************************
Jgl_TileMapCanvas.prototype.setPositionOffset = function(x, y) {
    this.tileMap.posOffsetX = x;
    this.tileMap.posOffsetY = y;
}

//*****************************************************
Jgl_TileMapCanvas.prototype.drawMap = function(xoff, yoff, forceRefresh) {
	
	// This function is called whenever the offscreen buffer does not contain the requested position
	function refreshBuffer(ctx, cornerstoneTileX, cornerstoneTileY) {
		//console.log("Regenerating at "+cornerstoneTileX+", "+cornerstoneTileY);
		ctx.tileMap.cornerstoneTileX = cornerstoneTileX; 
		ctx.tileMap.cornerstoneTileY = cornerstoneTileY; 
		var c, r, t;
		for (r = 0; r < ctx.tileMap.bufTilesTall; r++)
		{
			for (c = 0; c < ctx.tileMap.bufTilesWide; c++)
			{
                var row = cornerstoneTileY + r;
                var col = cornerstoneTileX + c;
                if (row >= 0 && row < ctx.mapData.numRows && col >= 0 && col < ctx.mapData.numColumns){
                    t = ctx.mapData.tiles[ctx.mapData.mapData[cornerstoneTileY + r][cornerstoneTileX + c]];
                } else {
                    t = ctx.mapData.defaultTile;
                }

                ctx.tileMap.bufContext.drawImage(
                    t.img,
                    t.x,t.y,
                    t.w,t.h,
                    ctx.mapData.tileWidth * c, ctx.mapData.tileHeight * r,
                    t.w,t.h
                );
			}
		}
	}

    xoff -= this.tileMap.posOffsetX;
    yoff -= this.tileMap.posOffsetY;

    // store current position
    this.tileMap.posX = xoff;
    this.tileMap.posY = yoff;

    // Let's see if the current buffer contains the requested map view. If not, re-render buffer.
	// Find the cornerstone (the tile in the top left corner) of the requested map view
	var cornerstoneTileX = (~~(xoff / this.mapData.tileWidth));  cornerstoneTileX -= (xoff < 0) ? 1 : 0;
	var cornerstoneTileY = (~~(yoff / this.mapData.tileHeight)); cornerstoneTileY -= (yoff < 0) ? 1 : 0;
	if (forceRefresh || (cornerstoneTileX !== this.tileMap.cornerstoneTileX) || (cornerstoneTileY !== this.tileMap.cornerstoneTileY)){
		refreshBuffer(this, cornerstoneTileX, cornerstoneTileY);
	}

	// calculate offset into cornerstone of map view
	var innerTileOffsetX;
	var innerTileOffsetY;

    if (xoff >= 0){
        innerTileOffsetX = xoff % this.mapData.tileWidth;
    } else {
        innerTileOffsetX = this.mapData.tileWidth + (xoff % this.mapData.tileWidth);
    }
    if (yoff >= 0){
        innerTileOffsetY = yoff % this.mapData.tileHeight;
    } else {
        innerTileOffsetY = this.mapData.tileHeight + (yoff % this.mapData.tileHeight);
    }

	// copy from buffer to requested canvas
	this.tileMap.context.drawImage(
		this.tileMap.bufCanvas, 
		innerTileOffsetX,
		innerTileOffsetY,
		this.tileMap.dispWidthPx, 
		this.tileMap.dispHeightPx,
		this.tileMap.dispX,
		this.tileMap.dispY,
		this.tileMap.dispWidthPx,
		this.tileMap.dispHeightPx
	);
//    console.log("MAP: "+xoff+","+yoff);
}

//*****************************************************
Jgl_TileMapCanvas.prototype.tileAt = function(x, y) {
    var tile = -1;
    if (x >= 0 && x < this.tileMap.dispWidthPx && y >= 0 && y < this.tileMap.dispHeightPx){
        tile = this.mapData.mapData[parseInt(x/64)][parseInt(y/64)];
    }
    return tile;
}