/**
 * CanvasController
 *
 * @description :: Server-side logic for managing canvas
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  'new': function(req, res){
    res.view('canvas/start');    
  },

  // no route, just get, check perm   //req.session.User = {};
      //console.log(req.session.User);
      
  'subscribe': function(req, res, next){
      
      console.log(req.params);
      var cc = req.session.correctConnect,
          author = req.session.author,
          canvasId = req.session.canvasId,
          socketId = req.socket.id;
    
      console.log("CC "+cc);
      console.log("A "+author);
      console.log("cID "+canvasId);
      console.log("sID "+socketId);
      
      if (author && cc && !canvasId && socketId){
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
            req.socket.emit("onCreate",{id: canvas.id, loggedOnly: canvas.loggedOnly, msg: "You have created room"});
            req.session.author = null;
            req.session.correctConnect = null;
            req.session.canvasId = null;
            next();
          }
          
        }); 
      } else if (!author && cc && canvasId){
        req.session.author = null;
        req.session.correctConnect = null;
        req.session.canvasId = null;
        req.socket.join(canvasId);
        req.socket.emit("onJoin",{msg:"You have joined room"});
        next();
      }
    

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
          req.session.correctConnect = true;
          req.session.author = true;
          
          res.locals.layout = 'canvasLayout';
          res.view('canvas/draw');  
        } else {
          res.redirect("/");
          return;
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
        res.view('canvas/draw');
        return;     
      });
  
    }

      
  },
  
 
  
};
/*
    Canvas.findOne().where({ id: id }).exec(function(err, canvas) {
      
            /*var params = req.params.all();
      params.user = req.session.User.id;
      params.nickname = req.session.User.nickname;
      
      //req.params.id = req.session.User;
        if (err) return next(err);
        
        //console.log(canvas);
        if(!canvas){
          res.notFound();
          return;
        }
        console.log("mam canvas", canvas);
        var socket = req.socket;
        var io = sails.io;
        io.sockets.emit('message', {thisIs: 'theMessage'});
        
        res.locals.layout = 'canvasLayout';
        res.view('canvas/draw',{id:canvas.id});
        return;
      
      });
*/
     /* Canvas.create(params, function canvasCreated(err, canvas){
        //console.log(canvas);
        if (err) {
          return res.redirect('/');
        }
        
        res.locals.layout = 'canvasLayout';
        req.session.flash = {
          id: id
        };
        res.view('canvas/draw');  
        //res.redirect('canvas/draw/'+canvas.id);  
      }); */
        
/*

// emit to all sockets (aka publish)
    // including yourself
    io.sockets.emit('messageName', {thisIs: 'theMessage'});
 
    // broadcast to a room (aka publish)
    // excluding yourself, if you're in it
    socket.broadcast.to('roomName').emit('messageName', {thisIs: 'theMessage'});
 
    // emit to a room (aka publish)
    // including yourself
    io.sockets.in('roomName').emit('messageName', {thisIs: 'theMessage'});
 
    // Join a room (aka subscribe)
    // If you're in the room already, no problem, do nothing
    // If the room doesn't exist yet, it gets created
    socket.join('roomName');
 
    // Leave a room (aka unsubscribe)
    // If you're not in the room, no problem, do nothing
    // If the room doesn't exist yet, no problem, do nothing
    socket.leave('roomName');
 
    // Get all connected sockets in the app
    sails.io.sockets.clients();
 
    // Get all conneted sockets in the room, "roomName"
    sails.io.sockets.clients('roomName');
*/