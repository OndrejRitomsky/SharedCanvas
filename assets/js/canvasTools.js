var sharedCanvas;


var ctx;
$(document).ready(function() {
  console.log("ready!");
  
  var canvas = $("#canvas")[0];
  if (!canvas)
    return;
  
  canvas.width  = 800;
  canvas.height = 600; 
  canvas.style.width  = '1024px';
  canvas.style.height = '768px';
  console.log(canvas);
  ctx = canvas.getContext("2d");
  /*Create SharedCanvas instace*/
  sharedCanvas = new SharedCanvas();
  sharedCanvas.initialization(canvas.getContext("2d"));
  
  
  
  /*Add onclick actions*/
  
 
  
  
  /*Add listeners*/
  canvas.addEventListener('mousedown',function (evt){
  
    var mousePos = getMousePos(canvas, evt);
    var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
    console.log(message);
    point(mousePos.x,mousePos.y,canvas.getContext("2d"));
  }, false);
  
});

/*
function canvasToolsPen(){
  
}*/

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x:  Math.round((evt.clientX-rect.left)/(rect.right-rect.left)*canvas.width),
    y:  Math.round((evt.clientY-rect.top)/(rect.bottom-rect.top)*canvas.height)
  };
}
/*
var canvasData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);

// That's how you define the value of a pixel //
function drawPixel (x, y, r, g, b, a) {
    var index = (x + y * canvasWidth) * 4;

    canvasData.data[index + 0] = r;
    canvasData.data[index + 1] = g;
    canvasData.data[index + 2] = b;
    canvasData.data[index + 3] = a;
}

// That's how you update the canvas, so that your //
// modification are taken in consideration //
function updateCanvas() {
    ctx.putImageData(canvasData, 0, 0);
}*/

function point(x, y, ctx){
  ctx.strokeRect(x,y,1,1);
}
/*
var mousedownID = -1;  //Global ID of mouse down interval
function mousedown(event) {
  if(mousedownID==-1)  //Prevent multimple loops!
     mousedownID = setInterval(whilemousedown, 100 /*execute every 100ms*/);


}
function mouseup(event) {
   if(mousedownID!=-1) {  //Only stop if exists
     clearInterval(mousedownID);
     mousedownID=-1;
   }

}
function whilemousedown() {
   /*here put your code*/
}
//Assign events
document.addEventListener("mousedown", mousedown);
document.addEventListener("mouseup", mouseup);
//Also clear the interval when user leaves the window with mouse
document.addEventListener("mouseout", mouseup);*/


