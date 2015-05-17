/**
 * CanvasController
 *
 * @description :: Server-side logic for managing canvas
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var serverSharedCanvas = require('./ServerSharedCanvas.js');
                         

module.exports = {
  'start': function(req, res){
      
    
    if (req.session.authenthicated){
      Picture.find().where({author:req.session.User.id}).exec(function(err, pictures){

        if (err){
          res.serverError(); 
        } else {
          res.view({pictures:pictures});
        }
      });
    } else {      
      res.view();
    }        
  },

  // no route, just get, check perm   //req.session.User = {};
      //console.log(req.session.User);
  
  'update': function(req,res){
    /* we need to check if host didnt close canvas so others dont try to add packages*/
   // console.log(req);
    //console.log(serverSharedCanvas.rooms);
    if(!req.body){
      return res.redirect("/");
    }
    if(!req.body.msg){
      return res.redirect("/");
    }
    serverSharedCanvas.addPackages(req.body.msg, req.body.rid);
  },
      
  'sync': function(req, res, next){
    if(!req.body.canvasurl && !req.socket.id){
      res.view("/");
    }
    serverSharedCanvas.syncRoom(req.socket.id, req.body.canvasurl); 
  },
  
  
  'decline': function(req, res, next){
    var id= req.session.User.id;
    if (!req.params.all().id)
      return res.redirect("/");
    Invite.destroy({id:req.params.all().id, to_user: id }).exec(function(err,invite){
      res.redirect('user/view');
    });
    
  },
  
  'subscribe': function(req, res, next){
      
    if (!req.session)
      return res.redirect("/");
    
    if (!req.session.correctConnect)
      return res.redirect("/");

    var author = req.session.author,
        canvasId = req.session.canvasId,
        socketId = req.socket.id;



    if (author && !canvasId && socketId){
      var params = {};
      params.userSocket = socketId; // who created this canvas
      params.loggedOnly = false; // can anybody who knows link join?

      Canvas.create(params, function canvasCreated(err, canvas){
        //console.log(canvas);
        if (err) {
          res.redirect('/');
          return;
        }

        if(!canvas){
          res.serverError();  
          return;
        } else {
          /*   var socket = req.socket;
            var io = sails.io;*/
          req.socket.join(canvas.id);

          serverSharedCanvas.createRoom(req.socket, socketId, canvas.id);
          //serverSharedCanvas.start(sails.io, req.socket, canvas.id);


          req.session.author = null;
          req.session.correctConnect = null;
          req.session.canvasId = null;
          next();
        }

      }); 
    } else if (!author && canvasId && socketId){
      console.log(socketId);
      req.session.author = null;
      req.session.correctConnect = null;
      req.session.canvasId = null;

      serverSharedCanvas.joinRoom(req.socket, socketId, canvasId);

      Canvas.findOne().where({ id: canvasId }).exec(function(err, canvas) { 
        console.log("autor je",canvas.userSocket);
        serverSharedCanvas.tellAuthorToSync(canvas.userSocket);
      });  
      //


      next();
    }
    

  },
  'invite': function(req, res, next){
    if (!req.body)
      return res.redirect("/");
    if (!req.body.name || !req.body.path)
      return res.redirect("/");
    
    
    User.findOne({nickname:req.body.name}).exec(function(err, user){  
      if (!user){
         return res.send({text:"Your friend doesn`t exist"});
      } else {
        var params = {};
        params.from_user = req.session.User.id;
        params.to_user = user.id;
        Invite.destroy(params, function(){
          if (err)
             return res.send({text:"Invite failed"});
          else {
            params.path = req.body.path; 
            Invite.create(params, function(err, invite){
              if (err)
                return res.send({text:"Invite failed"});
              else 
                return res.send({text:"Invite sent"});          
            });             
          }            
        });
      }
    })
    
  },

  'draw': function(req, res, next){
    
    var id = req.params.id;
    req.session.correctConnect = false;
    req.session.author = false;

    /*if(!req.session.User){
      res.view('static/index');
    }*/
    

    if(!id){
      console.log("nemam id");
      
      Canvas.count(function (err, num) {
        if(err) {
           return console.log(err);
        }
        console.log("Uz je", num, " canvasov");
        
        if (num<2){
          var pic = req.params.all().picture;
          if(pic){
            Picture.findOne().where({author: req.session.User.id, name: pic}).exec(function(err, picture){
              if (err){
                res.redirect("/canvas/start");                
              } else {                
                req.session.correctConnect = true;
                req.session.author = true;

                res.locals.layout = 'canvasLayout';
                res.view({path:picture.path}); 
              }
              
            });
          } else {

            req.session.correctConnect = true;
            req.session.author = true;

            res.locals.layout = 'canvasLayout';
            res.view({path:null}); 
          }
        } else {
          req.session.flash = {
            err: "Too many canvases"
          }
         
          return res.redirect('/canvas/start');
        }
        
      });      
    } else {
      
      req.session.correctConnect = true;
      req.session.author = false;
      console.log("hladam",id);
      
      Canvas.findOne().where({ id: id }).exec(function(err, canvas) {      
        console.log("mam odpoved pre ",id);
        if (err) return next(err);
        
        if(!canvas){
          res.notFound();
          return;
        }
        req.session.correctConnect = true;
        req.session.author = false;   
        req.session.canvasId = id;
        
        res.locals.layout = 'canvasLayout';
        res.view({path:null});
        return;     
      });
  
    }

      
  },  
};

