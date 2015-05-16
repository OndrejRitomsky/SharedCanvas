jQuery.validator.addMethod("alphanumeric",function(val,element){
  for (p in val){
    if ((val[p] < "A" || val[p] > "Z") && (val[p] < "a" || val[p] > "z") && (val[p]<"0" || val[p]>"9")){
      return false;
    }
  }
  return true;
})




$("#regForm").validate({
  rules:{
    email:{
      required: true,
      email: true
    },
    nickname:{
      minlength: 3,
      maxlength: 20,
      required: true,
      alphanumeric: true
    },
    password:{
      required: true,
      minlength: 5
    },
    password2:{
      required: true,
      minlength: 5,
      equalTo: "#password"
    }
    
  },
  messages:{
    email:{
      required: "E-mail is required",
    },
    nickname:{
      minlength: "Your nickname must consist of at least 3 characters",
      maxlength: "Your nickname must consist of less than 20 characters",
      required: "Nickname is required",
      alphanumeric: "Your nickname must consist of letters and numbers only"
    },
    password:{
      required: "Password is required",
      minlength: "Your password must consist of at least 5 characters",
    },
    password2:{
      required: "Password-check is required",
      minlength: "Your password must consist of at least 5 characters",
      equalTo: "Please enter the same password as above"
    }
  }  
  
});
