function SharedCanvas(){
  this.CANVAS_WIDTH = 800;
  this.CANVAS_HEIGHT = 600;
  
  this.CURSOR_PEN = 0;
  this.CURSONR_RUBBER = 1;
  
  this.COLOR_MIN_VAL = 0;
  this.COLOR_MAX_VAL = 255;
  
  this.COLOR_RED = "RED";
  this.COLOR_GREEN = "GREEN";
  this.COLOR_BLUE = "BLUE";
}

SharedCanvas.prototype.cursorType = 0;
SharedCanvas.prototype.colorRed = 0;
SharedCanvas.prototype.colorGreen = 0;
SharedCanvas.prototype.colorBlue = 0;

SharedCanvas.prototype.context = null;

/*SharedCanvas.prototype.myoffsetLeft = 0;
SharedCanvas.prototype.myoffsetTop = 0;*/

SharedCanvas.prototype.initialization = function(context){
  this.context = context;

}


SharedCanvas.prototype.changeColor = function(color, value){
  if (value<this.COLOR_MIN_VAL || value>this.COLOR_MAX_VAL)
    return;
  
  switch(color) {
    case this.COLOR_RED:
        this.colorRed = value;
        break;
    case this.COLOR_GREEN:
        this.colorGreen = value;
        break;
    case this.COLOR_BLUE:
        this.colorBlue = value;
        break;
  } 
}

