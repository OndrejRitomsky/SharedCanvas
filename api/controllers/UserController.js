/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	
  // Loads registration page "registration.ejs"
  'registration': function(req, res){
    res.view();    
  },
  
  // Create user with parameters from "registration.ejs"
  'create': function(req, res, next){
    
    User.create(req.params.all(), function userCreated(err, user){
      if (err) {
        req.session.flash = {
          err: err
        }
        
        return res.redirect('/user/registration');
      }
      
      res.redirect('/');
    });
    
  }
};

