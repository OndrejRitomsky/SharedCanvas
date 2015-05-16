/**
* Picture.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  schema: true,
  
  attributes: {  
    author: {
      model:'user'
    }, 
    name: {
      type: 'string',
      required: true,
      unique: true
    },
    
    path:{
      type: 'string',
      required: true
    },
    
    likes:{
        collection: 'like',
        via: 'picture'
    },
    
    inGallery:{
      type: 'boolean',
      defaultsTo: false
    }
    
  
  }
};

