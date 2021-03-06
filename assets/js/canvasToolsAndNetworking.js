var sharedCanvas;
var room = null;
var UPDATE_RATE = 50;
var uid= null;
var canvas;


$(document).ready(function() {
  
  // Setup CANVAS
  canvas = $("#canvas")[0];
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
  if (syncPath){
    console.log(syncPath);
    var myImage = new Image(800, 640);
    console.log(myImage);
    myImage.onload = function(){
      console.log("yuh");
      canvas.getContext("2d").drawImage(myImage,0,0); // Or at whatever offset you like
    };
    myImage.src = "http://localhost:1337/"+syncPath;
  }
  
  
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
  }).focus(function(){
    this.value = "";
  }); 
  
  $('#canvasGreen').bind('input', function(){
    checkInput(this, SharedCanvas.COLOR_GREEN);
    showInputColor(sharedCanvas.colorRed,sharedCanvas.colorGreen,sharedCanvas.colorBlue);
  }).focus(function(){
    this.value = "";
  }); 
  
  $('#canvasBlue').bind('input', function(){
    checkInput(this, SharedCanvas.COLOR_BLUE);
    showInputColor(sharedCanvas.colorRed,sharedCanvas.colorGreen,sharedCanvas.colorBlue);
  }).focus(function(){
    this.value = "";
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
 /* $('#linkInviteModal').on('shown.bs.modal', function () {
    $('#myInput').focus();
  })*/
  io.socket.on('message', function notificationReceivedFromServer ( message ) {
    console.log(message);
  });
  
  io.socket.on('onCreate', function notificationReceivedFromServer ( message ){    
    room = message.rid;
     uid = message.uid;
   
    prepareInviteDialog(room,message.msg);
    updateRoom(room,uid);
      
    sharedCanvas.roomState= SharedCanvas.ROOM_ONLINE;
  });
  
  io.socket.on('onJoin', function notificationReceivedFromServer ( message ){    
    room = message.rid;
    uid = message.uid;
    $( "#networkMessage" ).text(message.msg);  
    sharedCanvas.roomState= SharedCanvas.ROOM_ONLINE;
    disableCanvas();    
    updateRoom(room,uid);
  });
  
  io.socket.on('justMessage', function(message){
    $( "#networkMessage" ).text(message.msg); 
  });
  var k = 0;
  
  io.socket.on('updateMessage', function(message){
    //console.log("dostal som update");
    if (message.type=="update"){
      //console.log("type update");
      sharedCanvas.updateCanvas(message.msg,uid);
      return;      
    }
    if (message.type=="disable"){
      disableCanvas();
      $( "#networkMessage" ).text(message.msg);
      return;      
    }
    
    if (message.type=="syncOthers"){
      createSyncMessage();
    }
    if (message.type=="sync"){
      sharedCanvas.syncWithURL(message.msg);   
      //console.log("sync");
    }
  
    
  });
  
  // ADD nav menu listeners
  $("#downloadLink").bind('click', download);  
  
  $("#saveLink").click(function(){
    
    var val = $("#saveFileName").val();
    for (p in val){
      if ((val[p] < "A" || val[p] > "Z") && (val[p] < "a" || val[p] > "z") && (val[p]<"0" || val[p]>"9")){
        changeMessage("Image can contain only letters and number");
        return;
      }
    }

    $.ajax({type:"GET", url:"/csrfToken"}).done(function(e){
      var dt = canvas.toDataURL();  
      var fileName = val;
      
      $.post("/picture/save", {name:fileName, data:dt, _csrf: e._csrf}, function(ans){
        changeMessage(ans.text);     
      });
      $('#saveModal').modal('hide');     
    });    
  }); 
  

    

  
  // SUBSCRIBE TO CANVAS (JOIN/CREATE ROOM)
  io.socket.get("/canvas/subscribe");
  


});
function download(){
  var fileName = $("#fileName").val(); 
  var dt = canvas.toDataURL();  
  if (!fileName)
    this.download = "image";
  else 
    this.download = fileName;
  this.href = dt;
  $('#downloadModal').modal('hide');
}


function changeMessage(text){
   $( "#networkMessage" ).text(text);  
}

var img;
function createSyncMessage(){
  var url = canvas.toDataURL();
  console.log("create sync msg");
  io.socket.get("/csrfToken",function(e){     
    io.socket.post("/canvas/sync", {canvasurl:url, _csrf: e._csrf});
  });
  
}

function disableCanvas(){
   sharedCanvas.onlineRoomState = SharedCanvas.ONLINE_ROOM_SYNCING;  
}


function updateRoom(rid, uid){
  io.socket.get("/csrfToken",function(e){
      setInterval(function(){
        io.socket.post("/canvas/update", {rid:rid, msg: {buffer:sharedCanvas.getChangesBuffer(),uid: uid}, _csrf: e._csrf});
      }, UPDATE_RATE);      
  });
}

function prepareInviteDialog(rid,msg){
  var dialog = $( "#linkInviteModalBody" );  
  var link = "http://localhost:1337/canvas/draw/"+rid;
  dialog.text(link); 
  $( "#inviteActions" ).show();
  $( "#networkMessage" ).text(msg);
  
  $("#invite").click(function(){
   $.ajax({type:"GET", url:"/csrfToken"}).done(function(e){
      var dt = canvas.toDataURL();  
      var friendName = $("#friendName").val();
      
      console.log(friendName);
      $.post("/canvas/invite", {path:link, name:friendName, _csrf: e._csrf}, function(ans){
        changeMessage(ans.text);     
      });
      $('#nameInviteModal').modal('hide');     
    });  
  }); 
  
  
  
}

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
  if(val[0]=="0" && val.length>1){
    val = val.slice(1,val.length);    
  }
  
  if (!numbersOnly(val)){
    val = val.slice(0,val.length-1);
  } 
  var res = 0;
  if (!val){
    res = sharedCanvas.changeColor(color, "0"); 
  } else {
    res = sharedCanvas.changeColor(color, val);
    $(obj).val(res);
  }

    
}
function showInputColor(r,g,b){
  var color = "RGB("+r+","+g+","+b+")";
  $("#canvasResultColor").css("background-color",color);
}



