module.exports.express = {
   customMiddleware: function(app){
     app.use('/user_images', require('../node_modules/sails/node_modules/express').static('user_images'));
   }
}