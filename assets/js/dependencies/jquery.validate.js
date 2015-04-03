jQuery.fn.formValidation = function(elements){
  console.log("nefungujem");  
  
  this.submit(function(ev){
    var i = 0;
    var res = true;
    for (key in elements){
      //console.log(key);
      var elementValue = $("#"+key).val();
      //console.log(value);
      console.log(  );
      
      var valid = true;
      for (ind in elements[key]){
        var attribute = elements[key][ind]; // atribute + value
        
        var b = validateAttribute(attribute,elementValue);
        if (!b) 
          valid = false;
        //console.log(attribute,b);
      }
      if (valid){
        $(".error").each(function (ind, val){
          if (ind==i){
            $(this).html("OK!");
          } 
        });     
      }
      else {
        $(".error").each(function (ind, val){
          if (ind==i){
            $(this).html("Wrong!");
            res = false;
          } 
        });
      }
      i++;  
      
    }
    console.log(res);
    return res;
    
  
  });
  //return this.find('a[href]').hide().end();
}

function validateAttribute(attribute,val){

  switch(attribute[0]){
    case "required": return validateRequired(val);
    case "min_length": return validateMinLength(val,attribute[1]);
    case "max_length": return validateMaxLength(val,attribute[1]);
    case "alphanumeric": return validateAlphaNum(val);
    case "matches": return validateMatches(val,$("#"+attribute[1]).val());
    //case "required": validate(); break;
    
  
  }
}

function validateRequired(val){
  return val!=""?true:false;
}

function validateMinLength(val, min){
  return val.length >= min?true:false;
}
function validateMaxLength(val, max){
  return val.length <= max?true:false;
}

function validateAlphaNum(val){
  for (p in val){
    if ((val[p] < "A" || val[p] > "Z") && (val[p] < "a" || val[p] > "z") && (val[p]<"0" || val[p]>"9")){
      return false;
    }
  }
  return true;
}

function validateMatches(p1,p2){
  return p1==p2?true:false;
}








