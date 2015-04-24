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
  
  this.roomState = 1;
  this.onlineRoomState = 0;

}

SharedCanvas.ONLINE_ROOM_RUNNING = 0;
SharedCanvas.ONLINE_ROOM_SYNCING = 1;

SharedCanvas.ROOM_LOCAL = 1;
SharedCanvas.ROOM_ONLINE = 0;

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


// Initialization, instead of contructor... 
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
}


//Update canvas with packages from server

SharedCanvas.prototype.updateCanvas = function(packages, uid){

  this.context.save();
  for(var p in packages){
    var package = packages[p].buffer;
    var puid = packages[p].uid;
    
    var pos = {x:-1,y:-1};
    var i = 0;

    while(i < package.length){
      
      if(package[i]=='MT'){
        pos.x = package[i+1];
        pos.y = package[i+2];
        i += 3; 
        continue;
      } 
      if(package[i]=='LT'){
        
        this.context.beginPath();
        this.context.moveTo(pos.x, pos.y);        
        this.context.lineTo(package[i+1],package[i+2]);
        this.context.stroke(); 
        
        if (uid!=puid){
          // if this wasnt packet from us, draw the same line twice, bcs if it is from us, it already drawn twice
          this.context.beginPath();
          this.context.moveTo(pos.x, pos.y);
          this.context.lineTo(package[i+1],package[i+2]);
          this.context.stroke(); 
        }
       
        pos.x = package[i+1];
        pos.y = package[i+2];
        i += 3;
        continue;
      } 
      if(package[i]=='S'){         
        this.context.lineWidth = package[i+1];  
        this.context.strokeStyle = 'rgba('+package[i+2]+','+package[i+3]+','+package[i+4]+',1)';
        i += 5;        
        continue;
      } 
      i++; // ?
      
    } 
    
  }  
  this.context.restore();

}


var sendId = 0;
var getId = 0;

SharedCanvas.prototype.syncWithURL = function(url){
    
  console.log("TO");
  img = new Image;
  var t = this;
  img.onload = function(){
    //ctx.drawImage(img,0,0); // Or at whatever offset you like
    t.context.save();
    t.context.strokeStyle = 'rgba(0,0,0,1)';
    t.context.clearRect(0,0,800,600);
    t.context.drawImage(img,0,0);
    t.context.restore();
    t.onlineRoomState = SharedCanvas.ONLINE_ROOM_RUNNING;
    changeMessage("Synced");
  };
  img.src = url;
    

}
SharedCanvas.prototype.changeCursorWidth = function(value){
  this.settingsChanged = true;
  this.cursorWidth = value;
}
// Prepare buffer to be in correct form for sending.
SharedCanvas.prototype.getChangesBuffer = function(){
  var res = this.buffer;
  this.buffer = [];
  if(this.roomState!= SharedCanvas.ROOM_ONLINE){
    return [];  
  }

  var params = [this.cursorWidth, this.colorRed, this.colorGreen, this.colorBlue];
  this.addChangesToBuffer('S', params); 
  this.settingsChanged = false;
  
  if (res.length<=5)
    return [];
  
  
  if(this.mousedownID!=-1){
    // we are drawing right now, we need to copy last position as new MT for next buffer
      var i = res.length-1;
      var ind = -1;
      while(i>=0){
        if (res[i]=="LT"|| res[i]=="MT"){
          ind = i;
          break;
        }
        i--;
      }
      if (ind!=-1);
      this.addChangesToBuffer('MT', [res[ind+1],res[ind+2]]);
    
  }

  return res;
}
// Saves changed to network buffer.
SharedCanvas.prototype.addChangesToBuffer = function(action, params){
  if (action!='MT' && action!='LT' && action!='S')
    return;
  
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

//Calculates mouse position inside the canvas
SharedCanvas.prototype.getMousePos = function(evt) {
  var rect = this.canvas.getBoundingClientRect();
  return {
    x:  Math.round((evt.clientX-rect.left)/(rect.right-rect.left)*canvas.width) +0.5,
    y:  Math.round((evt.clientY-rect.top)/(rect.bottom-rect.top)*canvas.height) +0.5
  };  
}

SharedCanvas.prototype.lineTo = function(x, y){
  if(this.roomState== SharedCanvas.ROOM_ONLINE){
    this.addChangesToBuffer('LT', [x, y]); 
  }
  this.context.lineTo(x, y);   
}


//We are drawing, draw line and save position
SharedCanvas.prototype.whilemousedown = function() {
  if(this.onlineRoomState!=SharedCanvas.ONLINE_ROOM_RUNNING)
    return;

  if (this.mouseEvt!=null){
  
    var pos = this.getMousePos(this.mouseEvt);
    this.mouseEvt = null;
    if (!this.firedOnce){
      if(this.roomState== SharedCanvas.ROOM_ONLINE){
        this.addChangesToBuffer('MT', [pos.x, pos.y]); 
      } 
      this.counter = (this.counter + 1);// % 2;
      this.firedOnce = true;  
      this.oldPos = pos;
      return;
    }
    
    if (this.counter>0){
      this.context.beginPath();      
      this.context.moveTo(this.oldPos.x, this.oldPos.y);
      this.lineTo(pos.x, pos.y);   
      this.context.stroke();
      this.oldPos=pos;      
    }
    
    this.counter = (this.counter + 1);
  }
}


// We started drawing, set settings and save them to buffer if needed
SharedCanvas.prototype.onMouseDown = function(event) {
  if(this.onlineRoomState!=SharedCanvas.ONLINE_ROOM_RUNNING)
    return;
  
  if(this.mousedownID==-1){
    
     // DRAWING SETUP 
     this.context.lineWidth = this.cursorWidth;  
     this.context.strokeStyle = 'rgba('+this.colorRed+','+this.colorGreen+','+this.colorBlue+',1)';
    
     if(this.settingsChanged && this.roomState== SharedCanvas.ROOM_ONLINE){
       var params = [this.cursorWidth, this.colorRed, this.colorGreen, this.colorBlue];
       this.addChangesToBuffer('S', params);   
       this.settingsChanged = false;
     }

     var t = this;
     this.mousedownID = setInterval(function(){t.whilemousedown();}, SharedCanvas.CURSOR_DRAWING_UPDATE_RATE);
  }
}

// WE stopped drawing, make sure whilemousedown fired at least once so dot is drawn.
SharedCanvas.prototype.onMouseUp = function(event) {
  if(this.onlineRoomState!=SharedCanvas.ONLINE_ROOM_RUNNING)
    return;
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
// save mouse position
SharedCanvas.prototype.onMouseMove = function(event) { 
  this.mouseEvt = event;
}
