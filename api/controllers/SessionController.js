/**
 * SessionController
 *
 * @description :: Server-side logic for managing sessions
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var bcrypt = require('bcryptjs');

module.exports = {
  'new': function(req, res){
    res.redirect('session/login');
  },
  
  'destroy': function(req, res, next){
     req.session.destroy();
     res.redirect('/');
  },
  
  'create': function(req, res, next){
    

    if (!req.param('email') || !req.param('password')){
      var loginValidationError = {message: "You have to enter both email and password. "};
      
      req.session.flash = {
        err: loginValidationError
      }
      res.redirect('session/new');
      return;
    }

    User.findOneByEmail (req.param('email'), function(err, user) {

      if (err) return next(err); 
      var userNotFoundError = {message: "Email address or password is wrong"};
      
      if(!user){
        req.session.flash = {
          err: loginValidationError
        }
      
        res.redirect('session/new');
        return;
      }
      
      
      

      bcrypt.compare(req.param('password'), user.encPassword, function(err, valid){
        if (err) return next(err);

        if (!valid){
          req.session.flash = {
            err: loginValidationError
          }

          res.redirect('session/new');
          return;
        }
        
        req.session.authenthicated = true;
        req.session.User = user;
        
        res.redirect('/');
        return;
      });
      
    });
    
    
  }
	
};

