/**
* Invite.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    from_user: {
      model:'user'
    },
    
    to_user: {
      model:'user'
    },
    
    path: {
      type: 'string'
    }
    
  }
};

