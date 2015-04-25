
/*
 *socketId indentifies user, we are not using word "user", bcs even annonymouse user can work with canvas!
 */

/* TENTO SUBOR BY MAL BYT V API/SERVICES!!!*/
module.exports = {
  rooms : [],
  socketIdToRoom: {},  /* We could map socketId in room/canvas in database, currently we map only creatorsocketit to canvas */
  socketIdToSocket: {}, /* and we wont map to db socketId -> socket since socket is in memory anyway */
  roomToBufferAndUid: {}, //{buffer:buffer, uid:id} we give 0 1 2 3 4.. ID to every user in the room
  roomToUpdateID: {},

  UPDATE_RATE: 30,
  
  
  isInRoom: function(socketId){
    if(socketId in this.socketIdToRoom){
      return this.socketIdToRoom[socketId];
    } 
    return false;
  },
  
  tellAuthorToSync: function(author, room){
    var sckt = this.socketIdToSocket[author];  
    sckt.emit('updateMessage', {type:"syncOthers", msg: 'You have to sync others'});
  },
  
  syncRoom: function(socketId,url){

    var room = this.socketIdToRoom[socketId];
    sails.io.sockets.in(room).emit('updateMessage', {msg: url, type:"sync"});
  },
  
  addPackages: function(msg, room){
    if (msg.buffer.length<1)
      return;

    var buffer = this.roomToBufferAndUid[room].buffer;    
    
    if (!buffer)
      return;
    
    buffer.push(msg);
  },
  
  updateRoom: function(room){
    var buffer = this.roomToBufferAndUid[room].buffer;
    
    if (!buffer)
      return;
    
    if (buffer.length == 0){
      return;
    } else {
      sails.io.sockets.in(room).emit('updateMessage', {msg: buffer, type:"update"});
      this.roomToBufferAndUid[room].buffer = [];
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
    this.roomToBufferAndUid[room] = {uid:0, buffer:[]};
     
    socket.join(room);
    socket.emit("onCreate",{rid: room, msg: "You have created room and joined it", uid: 0});
    var t = this;
    var updateId = setInterval(function(){t.updateRoom(room);},this.UPDATE_RATE);
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
    this.roomToBufferAndUid[room].uid++;
    console.log(this.roomToBufferAndUid[room].uid);
    socket.join(room);    
    socket.emit("onJoin",{msg:"You have joined room - Syncing",rid: room, uid: this.roomToBufferAndUid[room].uid});
    socket.broadcast.to(room).emit('updateMessage', {type:"disable", msg: 'User has joined room - Syncing'});
   
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
    
    delete this.roomToBufferAndUid[room];
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