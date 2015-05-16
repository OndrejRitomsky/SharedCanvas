/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var bcrypt = require('bcryptjs');

module.exports = {
  schema: true,
  
  attributes: {
    
    email: {
      type: 'email',
      required: true,
      unique: true
    }, 

    encPassword: {
      type: 'string'
    }, 
    
    nickname: {
      type: 'string',
      required: true,
      unique: true,
      minLength: 3, 
      maxLength: 20,
      alphanumeric: true
    }, 
   
    admin: {
      type: 'boolean',
      defaultsTo: false
    },
    likes:{
        collection: 'like',
        via: 'from_user'
    },
    
    pictures:{
        collection: 'picture',
        via: 'author'
    },
    
    toJSON: function(){
      var obj = this.toObject();
      delete obj.password;
      delete obj.passwordCheck;
      delete obj.encPassword;
     // delete obj.user_id;
      delete obj._csrf;
      return obj;
    }
    
   
    
    
  },
    
  beforeCreate: function(values, next){
    if (values.password.length<5){
       return next({message:"Password too short"});
    }
    if (!values.password || !values.password2 ){
      return next({message:"Password and password-check can`t be empty"});
    }
    if (values.password != values.password2){
      return next({message:"Password doesn`t match password-check"});      
    }
    
    
    bcrypt.hash(values.password, 10, function passwordEncrypted(err, encPassword){
      if (err) return next(err);

      values.encPassword = encPassword;
      delete values.id;
      next();        
    });

  }
 
};

