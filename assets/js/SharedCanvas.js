function SharedCanvas(){
  this.cursorType = 0;
  this.cursorWidth = 3;
  this.colorRed = 0;
  this.colorGreen = 0;
  this.colorBlue = 0;

  this.canvas = null;
  this.context = null;

  this.counter = 0;
  this.mouseEvt = null;
  this.oldPos = null;
  this.firedOnce = false;
  this.mousedownID = -1;
}


SharedCanvas.CURSOR_DRAWING_UPDATE_RATE = 10;

SharedCanvas.CANVAS_WIDTH = 800;
SharedCanvas.CANVAS_HEIGHT = 600;

SharedCanvas.CURSOR_PEN = 0;
SharedCanvas.CURSONR_RUBBER = 1;

SharedCanvas.COLOR_MIN_VAL = 0;
SharedCanvas.COLOR_MAX_VAL = 255;

SharedCanvas.COLOR_RED = "RED";
SharedCanvas.COLOR_GREEN = "GREEN";
SharedCanvas.COLOR_BLUE = "BLUE";



SharedCanvas.prototype.initialization = function(canvas){

  this.canvas = canvas;
  this.context = this.canvas.getContext("2d");
  
  this.context.lineCap= "round";
  this.context.lineJoin= "mitter"; 
  //cxt.lineCap= "butt|round|square";
  //cxt.lineJoin= "round|bevel|miter"; 

}

SharedCanvas.prototype.changeColor = function(color, value){
  if (value < SharedCanvas.COLOR_MIN_VAL)
    return SharedCanvas.COLOR_MIN_VAL;
  if (value > SharedCanvas.COLOR_MAX_VAL)
    return SharedCanvas.COLOR_MAX_VAL;
  
  switch(color) {
    case SharedCanvas.COLOR_RED:
        this.colorRed = value;
        return value;
    case SharedCanvas.COLOR_GREEN:
        this.colorGreen = value;
        return value;
    case SharedCanvas.COLOR_BLUE:
        this.colorBlue = value;
        return value;
  } 
  
  return this.COLOR_MIN_VAL;
  
}

SharedCanvas.prototype.getMousePos = function(evt) {
  var rect = this.canvas.getBoundingClientRect();
  return {
    x:  Math.round((evt.clientX-rect.left)/(rect.right-rect.left)*canvas.width) +0.5,
    y:  Math.round((evt.clientY-rect.top)/(rect.bottom-rect.top)*canvas.height) +0.5
  };  
}


SharedCanvas.prototype.whilemousedown = function() {

  if (this.mouseEvt!=null){
  
    
    var pos = this.getMousePos(this.mouseEvt);
    
    if (!this.firedOnce){
      this.context.beginPath();
      this.context.moveTo(pos.x, pos.y); 
      
      this.counter = (this.counter + 1) % 2;
      this.firedOnce = true;  
      
      return;
    }
    
    if (this.counter==0){
      this.context.beginPath();
      
      if (this.oldPos!=null)
        this.context.moveTo(this.oldPos.x, this.oldPos.y); 
      else 
        this.context.moveTo(pos.x, pos.y); 
    }
    
    if (this.counter==1){
      this.context.lineTo(pos.x, pos.y);
      this.context.stroke(); 
      
      this.oldPos=pos;
    }
    
    this.counter = (this.counter + 1) % 2;
    //point(pos.x,pos.y,this.context);
  }
}




SharedCanvas.prototype.onMouseDown = function(event) {
  
  if(this.mousedownID==-1){
    
     // DRAWING SETUP 
     this.context.lineWidth = this.cursorWidth;  
     this.context.strokeStyle = 'rgba('+this.colorRed+','+this.colorGreen+','+this.colorBlue+',1)';
    
     // -------------------
     var t = this;
     this.mousedownID = setInterval(function(){t.whilemousedown();}, SharedCanvas.CURSOR_DRAWING_UPDATE_RATE);
  }
}

SharedCanvas.prototype.onMouseUp = function(event) {
  if(this.mousedownID!=-1) {  //Only stop if exists
     clearInterval(this.mousedownID);
     this.mousedownID=-1;
     if (this.counter==1){
       this.whilemousedown();  
     }

     this.counter = 0;
     this.context.stroke();
     this.oldPos = null;
     this.firedOnce = false;
   }
}

SharedCanvas.prototype.onMouseMove = function(event) { 
  this.mouseEvt = event;
}


// ---------------------------------------
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
