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
      req.session.authenthicated = true;
      req.session.User = user;
      
      res.redirect('/');
    }); 
  },
  
  'view': function(req, res, next){
    var author = req.session.User.id;

    Picture.find().where({author: author}).populate('likes').exec(function(err, pictures){
      if (err) {
        req.session.flash = {
          err: err
        }
        return res.redirect('/');
      }
      var result = [];
      for (var i in pictures){
        var obj = {};
        obj.name = pictures[i].name;
        obj.author = pictures[i].author;
        obj.path = pictures[i].path;
        obj.likes = pictures[i].likes.length;
        if (pictures[i].inGallery)
          obj.inGallery = "Yes";
        else 
          obj.inGallery = "No";
        result.push(obj);
      }
      
      Invite.find().where({to_user: author}).populate('from_user').exec(function(err,invites){
        if (err)
            res.view({pictures:result, invites: ""});
        
        res.view({pictures:result, invites: invites});
      });
      
    
    });
  } 
  
};

