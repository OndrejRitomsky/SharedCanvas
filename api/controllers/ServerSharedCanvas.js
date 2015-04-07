//var sails = require('sails');

/*
 *socketId indentifies user, we are not using word "user", bcs even annonymouse user can work with canvas!
 */
module.exports = {
  rooms : [],
  socketIdToRoom: {},  /* We could map socketId in room/canvas in database, currently we map only creatorsocketit to canvas */
  socketIdToSocket: {}, /* and we wont map to db socketId -> socket since socket is in memory anyway */
  roomToBuffer: {},
  roomToUpdateID: {},
  
  /*start: function(io, socket, room){
    this.io = io;
    this.socket = socket;
    this.room = room;
   
  
    this.io.on("updateMessage", function(msg){
      this.io.sockets.in(this.room).emit('updateMessage', {msg: 'dostal som update'});
      
    });
    
  },*//*
  update: function(msg){
     this.io.sockets.in(this.room).emit('updateMessage', {msg: 'dostal som update'});    
  },*/
  
  isInRoom: function(socketId){
    if(socketId in this.socketIdToRoom){
      return this.socketIdToRoom[socketId];
    } 
    return false;
  },
  addPackages: function(msg, room){
    if (msg.length<1)
      return;
    
    var buffer = this.roomToBuffer[room];
    if (!buffer)
      return;
    console.log(buffer);
    for (var i = 0; i<msg.length;i++){
      buffer.push(msg[i]);
    }
    console.log(buffer);
  },
  
  updateRoom: function(room){
    console.log("Updatujem "+room);

    
    var buffer = this.roomToBuffer[room];
    
    if (!buffer)
      return;
    
    if (buffer.lenght == 0){
      return;
    } else {
      sails.io.sockets.in(room).emit('updateMessage', {msg: buffer});
      buffer = [];
    }
  },
 /* 
  * user creates new room and joins it
  */
  createRoom: function(socket, socketId, room){

    if (room in this.rooms){
      console.log("roomka existuje!");
      return false;
    }
    
    this.rooms.push(room);  
    this.socketIdToRoom[socketId] = room;    
    this.socketIdToSocket[socketId] = socket;
    this.roomToBuffer[room] = [];
    
    
    socket.join(room);
    socket.emit("onCreate",{id: room, msg: "You have created room and joined it"});
    var t = this;
    var updateId = setInterval(function(){t.updateRoom(room);},2000);
    this.roomToUpdateID[room] = updateId; 
  },
  
  /* 
  * user joins specified room
  */
  joinRoom: function(socket, socketId, room){ 

    var roomExists = false;    
    for (i in this.rooms){
      if (this.rooms[i] == room)
        roomExists = true;
    }
    

    if (!roomExists)
      return false;
  
    
    this.socketIdToRoom[socketId] = room;
    this.socketIdToSocket[socketId] = socket;
    
    socket.join(room);    
    socket.emit("onJoin",{msg:"You have joined room",id: room});
    socket.broadcast.to(room).emit('justMessage', {msg: 'User has joined room'});
  },
  
  deleteRoom: function(sockedId, room){
    
    var ids = sails.io.sockets.adapter.rooms[room]; // sockedIds connected to room
    clearInterval(this.roomToUpdateID[room]);

    if(ids){
      for(var i in ids){      
        this.socketIdToSocket[i].emit("justMessage",{msg:"You have been forced to leave room, author left"});           
        this.leaveRoom(i,room);
      }      
    }
    // deleteRoom is called from afterDisconnect -> this socket already automaticaly left room
    // so we have to clean it

    this.leaveRoom(sockedId, room);        
    this.rooms.splice(this.rooms.indexOf(room),1);
    
    delete this.roomToBuffer[room];
    delete this.roomToUpdateID[room];


    
  },
  // io doesnt require leaving, its only cleaning, unless we force them to leave
  leaveRoom: function(socketId, room){
    var socket = this.socketIdToSocket[socketId];
    if(socket){
      socket.broadcast.to(room).emit('justMessage', {msg: 'User has left room'});
      
      socket.leave(room); // this might already happen, if leave room is called from deleteRoom, since its called from afterDisconnect
      delete this.socketIdToRoom[socketId];
      delete this.socketIdToSocket[socketId];
    }
  }
  
  
};