var sharedCanvas;

$(document).ready(function() {
  
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
    sharedCanvas.cursorWidth = $('#canvasCursorWidth').val();
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



