
window.addEventListener("load", gameInit, false);	

var j = null;
var img = [];

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       || 
		  window.webkitRequestAnimationFrame || 
		  window.mozRequestAnimationFrame    || 
		  window.oRequestAnimationFrame      || 
		  window.msRequestAnimationFrame     || 
		  function(/* function */ callback, /* DOMElement */ element){
			window.setTimeout(callback, 1000 / 10);
		  };
})();
    
function gameInit() 
{
	console.log("Starting Game...");
	var theCanvas = document.getElementById("screenCanvas");
	var context = theCanvas.getContext("2d"); 
	context.font = "20px _sans";

	console.log("Creating new map...");
	j = jgl_NewTileMap(context, 30, 25, 320, 320);

	img[0] = new Image(); img[0].src = "tile0.png";
	j.newTile(0, img[0], 0, 0, 64, 64);

	img[1] = new Image(); img[1].src = "tile1.png";
	j.newTile(1, img[1], 0, 0, 64, 64);

	j.attachMap(10,10,64,64,[   [0,1,0,1,0,1,0,1,0,1],
								[1,0,1,0,1,0,1,0,1,0],
								[0,1,0,1,0,1,0,1,0,1],
								[1,0,1,0,1,0,1,0,1,0],
								[0,1,0,1,0,1,0,1,0,1],
								[1,0,1,0,1,0,1,0,1,0],
								[0,1,0,1,0,1,0,1,0,1],
								[1,0,1,0,1,0,1,0,1,0],
								[0,1,0,1,0,1,0,1,0,1],
								[1,0,1,0,1,0,1,0,1,0]
							]);	
	gameLoop();
}

var x = 0;
var y = 0;
function gameLoop()
{
	x = (++x)%128;
	y = (++y)%128;
	j.drawMap(x,y);
    requestAnimFrame(gameLoop);
}

