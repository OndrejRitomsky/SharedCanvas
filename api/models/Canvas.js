module.exports = {
  schema: true,
  
  attributes: {  
    
    userSocket: {
      type: 'string',
      required: true
    }, 
    loggedOnly: {
      type: 'boolean',
      defaultsTo: false
    }, 
    
    toJSON: function(){
      var obj = this.toObject();
      return obj;
    }
  }
  
};

