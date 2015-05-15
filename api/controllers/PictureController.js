/**
 * PictureController
 *
 * @description :: Server-side logic for managing pictures
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var fs = require('fs');
module.exports = {
  'save': function(req, res, next){

  //  console.log(req.body.data); 
    console.log(req.body.name);
    
    var name = req.body.name;
    
    var data = req.body.data;
    var path = "user_images/test";
    
    try{
      fs.mkdir(path, function(e){
        console.log(e);
      });      
    } catch (e){
      console.log(e);
    }
    //EEXIST code
    
    var base64Data = data.replace(/^data:image\/png;base64,/, "");
    
    var filePath = path+"/"+name+".png"; 
    fs.writeFile(filePath, base64Data, 'base64', function(err) {
     
      console.log(err);
      if (!err){
        var params = {};
        params.author = "test";
        params.path = filePath;
        params.name = name;
        Picture.create(params, function canvasCreated(err, canvas){
           if (err)
             return res.send({text:"File not saved"});

           console.log("suc");
           return res.send({text:"File saved"});
        });  
      }
    });
   
  },
  
  'mydelete': function(req, res, next){

    console.log(req.body);
    console.log(req.params);
    
    /*var user = req.body.name;
    
    
    var params = {};
    params.author = req.body.name;
    params.data = req.body.data;
    params.name = req.body.name;
    Picture.create(params, function canvasCreated(err, canvas){
       if (err)
         return res.send({text:"File not saved"});
      
       console.log("suc");
       return res.send({text:"File saved"});
       
    });*/
   return res.redirect('user/view');
  }, 
  
  
  'gallery': function(req, res, next){
    console.log("abc");
     Picture.find().exec(function(err, pictures){
      if (err) {
        req.session.flash = {
          err: err
        }
        return res.redirect('/');
      }
       
      res.view({pictures:pictures});
     });    
  },
  
  
  
  
  
};

