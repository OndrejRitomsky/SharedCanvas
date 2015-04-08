var sharedCanvas;
var room = null;
var UPDATE_RATE = 50;

$(document).ready(function() {
  
  
  
  // Setup CANVAS
  var canvas = $("#canvas")[0];
  if (!canvas)
    return;
  
  canvas.width  = 800;
  canvas.height = 600; 
  canvas.style.width  = '800px';
  canvas.style.height = '600px';
  
  /*Create SharedCanvas instace and init*/
  sharedCanvas = new SharedCanvas();
  if (!sharedCanvas)
    return;
  
  sharedCanvas.initialization(canvas);
  
  /*Reset Inputs*/
  
  $('#canvasRed').val(sharedCanvas.colorRed);
  $('#canvasGreen').val(sharedCanvas.colorGreen);
  $('#canvasBlue').val(sharedCanvas.colorBlue);
  sharedCanvas.cursorWidth = $('#canvasCursorWidth').val();
  showInputColor(sharedCanvas.colorRed,sharedCanvas.colorGreen,sharedCanvas.colorBlue);
  
  
  /*Add Input Events*/
  
  $('#canvasRed').bind('input', function(){
    checkInput(this, SharedCanvas.COLOR_RED);
    showInputColor(sharedCanvas.colorRed,sharedCanvas.colorGreen,sharedCanvas.colorBlue);
  });
  $('#canvasGreen').bind('input', function(){
    checkInput(this, SharedCanvas.COLOR_GREEN);
    showInputColor(sharedCanvas.colorRed,sharedCanvas.colorGreen,sharedCanvas.colorBlue);
  }); 
  $('#canvasBlue').bind('input', function(){
    checkInput(this, SharedCanvas.COLOR_BLUE);
    showInputColor(sharedCanvas.colorRed,sharedCanvas.colorGreen,sharedCanvas.colorBlue);
  });
  $('#canvasCursorWidth').bind('input', function() {
    sharedCanvas.changeCursorWidth($('#canvasCursorWidth').val());
  });
  
  
  /*Add Mouse listeners*/
  canvas.addEventListener('mousedown', function(e){
    sharedCanvas.onMouseDown(e);
  });
  canvas.addEventListener('mouseup', function(e){
    sharedCanvas.onMouseUp(e);
  });
  canvas.addEventListener('mouseout', function(e){
    sharedCanvas.onMouseUp(e);
  });
  canvas.addEventListener('mousemove', function(e){
    sharedCanvas.onMouseMove(e);
  });
  
  // Add IO Listeners
  io.socket.on('message', function notificationReceivedFromServer ( message ) {
    console.log(message);
  });
  
  io.socket.on('onCreate', function notificationReceivedFromServer ( message ){    
    room = message.rid;
    var dialog = $( "#dialog" );
    dialog.prop('title', 'Invite Link:');
    
    dialog.text("http://localhost:1337/canvas/draw/"+message.rid); 
    
    dialog.dialog({
      resizable: false,
      autoOpen: false,
      height: 150,
      width: 600,
      modal: true
    });
    $( "#inviteActions" ).show();
    
    $( "#inviteLink" ).click(function(){
       dialog.dialog("open");
    });
    $( "#networkMessage" ).text(message.msg);
    
    console.log("abc");
 
    io.socket.get("/csrfToken",function(e){
      setInterval(function(){
        io.socket.post("/canvas/update", {rid:room, msg: {buffer:sharedCanvas.getChangesBuffer(),uid: message.uid}, _csrf: e._csrf});
      }, UPDATE_RATE);      
    });
    
    sharedCanvas.saveToBuffer = true;

    /*setInterval(function(){
      io.socket.post("/canvas/update",{msg: "rozosielam tuto sprav"});
    },1000);*/
    
  });
  
  io.socket.on('onJoin', function notificationReceivedFromServer ( message ){    
    room = message.rid;
    $( "#networkMessage" ).text(message.msg);  
      sharedCanvas.saveToBuffer = true;
      io.socket.get("/csrfToken",function(e){
        setInterval(function(){
          io.socket.post("/canvas/update", {rid:room, msg: {buffer:sharedCanvas.getChangesBuffer(),uid: message.uid}, _csrf: e._csrf});
        }, UPDATE_RATE);       
      });
  });
  
  io.socket.on('justMessage', function(message){
    $( "#networkMessage" ).text(message.msg); 
  });
  var k = 0;
  
  io.socket.on('updateMessage', function(message){
    //console.log("dostal som update");
    sharedCanvas.updateCanvas(message.msg);
  });

  
  
  // SUBSCRIBE TO CANVAS (JOIN/CREATE ROOM)
  io.socket.get("/canvas/subscribe");
  

  
});

function numbersOnly(val){
  for(var i = 0; i < val.length; i++){
    if(val[i]<'0' || val[i]>'9'){
      return false;    
    }
  }
  return true;
}

function checkInput(obj, color){
  var val = $(obj).val();
  if (!numbersOnly(val)){
    val = val.slice(0,val.length-1);
  }
  var res = sharedCanvas.changeColor(color, val); 
  $(obj).val(res);  
}
function showInputColor(r,g,b){
  var color = "RGB("+r+","+g+","+b+")";
  $("#canvasResultColor").css("background-color",color)
}



