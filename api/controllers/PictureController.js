/**
 * PictureController
 *
 * @description :: Server-side logic for managing pictures
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var fs = require('fs');
module.exports = {
  'save': function(req, res, next){    
     if (!req.body){
       return res.redirect("/");
    }
    var name = req.body.name;
    
    var data = req.body.data;
    
    if(!name || !data)
      return res.redirect("/");
    
    var path = "user_images/"+req.session.User.nickname;
    Picture.destroy().populate('author',{nickname:req.session.User.nickname}).where({name: req.body.name}).exec(function(err, deleted){
      if (err)
         return res.send({text:"File not saved"});
      
      
      Picture.find().populate('author',{id:req.session.User.id}).exec(function(err, pictures){
        if (err)
          return res.send({text:"File not saved"});
        
        if(pictures.length>2){
          return res.send({text:"File not saved, you have too many pictures. You can delete one by passing picture`s name"});
        } else {
          fs.mkdir(path, function(e){
            if (!e || e.code=='EEXIST'){
              var base64Data = data.replace(/^data:image\/png;base64,/, "");

              var filePath = path+"/"+name+".png"; 
              fs.writeFile(filePath, base64Data, 'base64', function(err) {

                if (!err){
                  var params = {};
                  params.author = req.session.User.id;
                  params.path = filePath;
                  params.name = name;
                  Picture.create(params, function(err, canvas){
                     if (err)
                       return res.send({text:"File not saved"});


                     return res.send({text:"File saved"});
                  });  
                }
              });
            }
          });   
        }
      });
    });
  },
  
  'mydelete': function(req, res, next){
    if (!req.body){
       return res.redirect('/');
    }
    if (req.body.isSure!="on"){
      return res.redirect('user/view');
    }
 

    var params = {};
    params.author = req.session.User.id;
    params.name = req.body.fileName;
    if(!params.author || !params.name)
      return res.redirect('user/view');
    
    Picture.destroy().where(params).exec(function(err, picture){
       if (err)
         res.redirect('user/view');
      
      if (picture.length < 1){
         res.redirect('user/view');
      }
      fs.unlink(picture[0].path, function(){})
      
      Like.destroy({picture:picture[0].id}).exec(function(err, likes){
        // if "cascade" delete fails, do nothing, picture still deleted
      });
      
      res.redirect('user/view');
      
      
       
    });
  }, 
  
  'galleryToogle': function(req, res, next){ 
    if (!req.body){
       return res.redirect("/");
    }
     
    var params = {};
    params.author = req.session.User.id;
    params.name = req.body.fileName;

    if(!params.author || !params.name)
      return res.redirect("user/view");
    
    Picture.findOne().where({name:params.name}).populate('author',{id:params.author}).exec(function(err, picture){
      if (err)
         res.redirect('user/view');
         
      Picture.update(params, {inGallery:!picture.inGallery},function(err, picture2){
        if (err)
          res.redirect('user/view');
      
        res.redirect('user/view'); 
      });
       
    });   
  }, 
  
  
  
  'gallery': function(req, res, next){
     
     Picture.find().populate('author').populate('likes').exec(function(err, pictures){
  
      if (err) {
        req.session.flash = {
          err: err
        }
        return res.redirect('/');
      }
      var result = [];
      for (var i in pictures){
        if (!pictures[i].inGallery)
          continue;
        var obj = {};
        obj.name = pictures[i].name;
        obj.author = pictures[i].author.nickname;
        obj.path = pictures[i].path;
        obj.likes = pictures[i].likes.length;
        
        if (req.session.authenthicated){
          var me = req.session.User.i;
          obj.liked = false;
          for (var j = 0; j < pictures[i].likes.length; j++){
            if(pictures[i].likes[j].from_user.id==me){
              obj.liked = true;
              break;
            }
          }
        } else {
          obj.liked = false;          
        } 

        result.push(obj);
      }
       
      res.view({pictures:result});
     });    
  },
  
  
  'like': function(req, res, next){
    if (!req.body){
       return res.redirect("/");
    }
    if(!req.body.author || !req.body.name)
      return res.redirect("/");
    
    Picture.findOne().populate("author",{nickname: req.body.author}).where({name:req.body.name}).exec(function(err, picture){
      if (!err && picture){
        var params = {};
        params.picture = picture.id;
        params.from_user = req.session.User.id;  // session
        Like.destroy(params, function(err, desLike){
          if (err) return res.redirect("picture/gallery");
                                       
          Like.create(params, function(err, like){
            if (err)
              return res.redirect("picture/gallery");
            console.log("created");
            return res.send({msg:"created"});
          });
        })
      } else {
        return res.redirect("picture/gallery");
      } 
      
    });
  },
  
  'unlike': function(req, res, next){    
     if(!req.body.author)
       return res.redirect("/");
    Like.destroy().populate("from_user",{name:req.session.id}).populate("picture",{author:req.body.author,               name:req.body.name}).exec(function(err, like){
      if (err){
        return res.serverError();
      }    
      return res.send({msg:"deleted"});
    });
   }
                                                                              
  
  
  
  
  
};

