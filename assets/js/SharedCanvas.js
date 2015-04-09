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
  
  this.io = null;
  
  this.buffer = []; // [S,W,R,G,B,(A,X,Y)*, ...]
  this.settingsChanged = true;
  
  this.saveToBuffer = false;
  
  this.oldCanvasState = null; // not setting state, but image! 
  
  this.lastActionMoveTo = null;
  this.needReMoveTo = null;
  this.reMoveToPos = {x:0,y:0};
  
}


SharedCanvas.CURSOR_DRAWING_UPDATE_RATE = 5;

SharedCanvas.CANVAS_WIDTH = 800;
SharedCanvas.CANVAS_HEIGHT = 600;

SharedCanvas.CURSOR_PEN = 0;
SharedCanvas.CURSONR_RUBBER = 1;

SharedCanvas.COLOR_MIN_VAL = 0;
SharedCanvas.COLOR_MAX_VAL = 255;

SharedCanvas.COLOR_RED = "RED";
SharedCanvas.COLOR_GREEN = "GREEN";
SharedCanvas.COLOR_BLUE = "BLUE";



SharedCanvas.prototype.initialization = function(canvas, io){
  this.io = io;
    
  this.canvas = canvas;
  this.context = this.canvas.getContext("2d");
  
  this.context.lineCap= "round";
  this.context.lineJoin= "mitter"; 
  //cxt.lineCap= "butt|round|square";
  //cxt.lineJoin= "round|bevel|miter"; 
  this.settingsChanged = true;
  
  // ---------- !!!!!!!!!!!!!!!!!!!!!!! ----------------
  this.oldCanvasState = this.context.createImageData(SharedCanvas.CANVAS_WIDTH, SharedCanvas.CANVAS_HEIGHT);
}



// uid vymazat
SharedCanvas.prototype.updateCanvas = function(packages, uid){
  //return;
  this.context.save();

  //if (this.lastActionMoveTo)
  //  this.needReMoveTo=true;
  // ---------- !!!!!!!!!!!!!!!!!!!!!!! ----------------
  //this.context.putImageData(this.oldCanvasState, 0 , 0);

  for(var p in packages){
    var package = packages[p].buffer;
    var puid = packages[p].uid;
    
    
    console.log(uid);
    console.log(puid);
    
    
    var pos = {x:-1,y:-1};
    var i = 0;
    //console.log(package);
    this.context.beginPath();
    while(i < package.length){
      if(package[i]=='MT'){
        //this.context.beginPath();
        //this.context.moveTo(package[i+1],package[i+2]);
        pos.x = package[i+1];
        pos.y = package[i+2];
        i += 3; 
        continue;
      } 
      if(package[i]=='LT'){
        this.context.beginPath();
        this.context.moveTo(pos.x, pos.y);
        this.context.lineTo(package[i+1],package[i+2]);
        if (uid!=puid){
          this.context.moveTo(pos.x, pos.y);
          this.context.lineTo(package[i+1],package[i+2]);
        }
        this.context.stroke(); 
        pos.x = package[i+1];
        pos.y = package[i+2];
        i += 3;
        continue;
      } 
      if(package[i]=='S'){         
        // settings out of beginpath?
    
        this.context.lineWidth = package[i+1];  
        this.context.strokeStyle = 'rgba('+package[i+2]+','+package[i+3]+','+package[i+4]+',1)';
    
        //package[i+2]
        i += 5;        
        continue;
      } 
      i++; // ?
      
    } 
    
  }  
   
  
  //this.oldCanvasState = this.context.getImageData(0, 0, SharedCanvas.CANVAS_WIDTH, SharedCanvas.CANVAS_HEIGHT);
  

  this.context.restore();

}


  var sendId = 0;
var getId = 0;

SharedCanvas.prototype.changeCursorWidth = function(value){
  this.settingsChanged = true;
  this.cursorWidth = value;
}
// WIPES BUFFER!!
SharedCanvas.prototype.getChangesBuffer = function(){
  var res = this.buffer;
  this.buffer = [];
  
  if(this.saveToBuffer){
    var params = [this.cursorWidth, this.colorRed, this.colorGreen, this.colorBlue];
    this.addChangesToBuffer('S', params); 
  }
  this.settingsChanged = false;
  
  if (res.length<=5)
    return [];
  
  
  if(this.mousedownID!=-1){
    // we are drawing right now, we need to copy last position as new MT for next buffer
      var i = res.length-1;
      var ind = -1;
      while(i>=0){
        if (res[i]=="LT"){
          ind = i;
          break;
        }
        i--;
      }
      this.addChangesToBuffer('MT', [res[ind+1],res[ind+2]]);
    
  }
  
  /* if last action was MT, we ll splice it out and add it to next buffer.*/
  /*if (lastMT){

    
    if (ind>0){
      var lastMTAction = res.splice(ind,3); 
      this.addChangesToBuffer('MT', [lastMTAction[1],lastMTAction[2]]);
     
    }
  }
  lastMT = null;*/


  return res;
}
var lastMT = null;
SharedCanvas.prototype.addChangesToBuffer = function(action, params){
  if (action!='MT' && action!='LT' && action!='S')
    return;
  
  if(action=='MT'){
    lastMT = true;
  } else if(action=='LT'){
    lastMT = false;
  } 
  
  this.buffer.push(action);
  for (var i = 0; i < params.length; i++){
    this.buffer.push(params[i]);
  }
}

SharedCanvas.prototype.changeColor = function(color, value){
  if (value < SharedCanvas.COLOR_MIN_VAL)
    return SharedCanvas.COLOR_MIN_VAL;
  if (value > SharedCanvas.COLOR_MAX_VAL)
    return SharedCanvas.COLOR_MAX_VAL;
  
  this.settingsChanged = true;
  
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


SharedCanvas.prototype.moveTo = function(x, y){
  if(this.saveToBuffer){
    this.addChangesToBuffer('MT', [x, y]); 
    
  }
  this.lastActionMoveTo = true;
  this.reMoveToPos.x = x;
  this.reMoveToPos.y = y;
  this.context.moveTo(x, y); 
  
}

SharedCanvas.prototype.lineTo = function(x, y){
  if(this.saveToBuffer){
    this.addChangesToBuffer('LT', [x, y]); 
  }
  this.lastActionMoveTo = false;
  this.context.lineTo(x, y);   
}



SharedCanvas.prototype.whilemousedown = function() {

  if (this.mouseEvt!=null){
  
    var pos = this.getMousePos(this.mouseEvt);
    
    if (!this.firedOnce){
      //this.context.beginPath();
      this.moveTo(pos.x,pos.y);
      this.counter = (this.counter + 1);// % 2;
      this.firedOnce = true;  
      this.oldPos = pos;
      return;
    }
    
   /* if (this.counter==0){
      this.context.beginPath();      
      if (this.oldPos!=null){
        this.moveTo(this.oldPos.x, this.oldPos.y);
      } else {
        this.moveTo(pos.x,pos.y);
      }

    }*/
    
    if (this.counter>0){
      this.context.beginPath();      
      this.context.moveTo(this.oldPos.x, this.oldPos.y);
      if(this.needReMoveTo){
        this.context.moveTo(this.reMoveToPos.x,this.reMoveToPos.y);
        this.needReMoveTo = false;
      }
      this.lineTo(pos.x, pos.y);   
      this.context.stroke();
      this.oldPos=pos;

    }
    
    this.counter = (this.counter + 1);// % 2;
  }
}

SharedCanvas.prototype.onMouseDown = function(event) {
  
  if(this.mousedownID==-1){
    
     // DRAWING SETUP 
     this.context.lineWidth = this.cursorWidth;  
     this.context.strokeStyle = 'rgba('+this.colorRed+','+this.colorGreen+','+this.colorBlue+',1)';
    
     if(this.settingsChanged && this.saveToBuffer){
       var params = [this.cursorWidth, this.colorRed, this.colorGreen, this.colorBlue];
       this.addChangesToBuffer('S', params);   
       this.settingsChanged = false;
     }
    
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
