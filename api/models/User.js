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
      unique: true
    }, 
   
    admin: {
      type: 'boolean',
      defaultsTo: false
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
    if (!values.password || values.password != values.password2){
      return next({err: {message:"Password doesn`t match password-check"}});
    }
    
    
    bcrypt.hash(values.password, 10, function passwordEncrypted(err, encPassword){
      if (err) return next(err);

      values.encPassword = encPassword;
      delete values.id;
      next();        
    });

  }
 
};

