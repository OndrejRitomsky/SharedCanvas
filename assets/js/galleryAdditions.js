$(document).ready(function(){

   if(!$("#blueimp-gallery"))
     return;
    
   $("#blueimp-gallery").on('slide', function (event, index, slide) {
         
     var link = $("#links").children()[index];
     var author = link.getAttribute('data-author');
     var name = link.getAttribute('data-name');
     var likes = link.getAttribute('data-likes');
     var liked = link.getAttribute('data-liked');
       
     console.log(author, name , likes);
       
     var likesDOM = $(".slide").find(".mylikes")[index];
     var likesOB =  $(".slides").find(likesDOM);
     likesOB.html(likes);
     
     var likeItDOM = $(".slide").find(".likeIt")[index];

     if (!likeItDOM)
       return;
     
     var likeItOb =  $(".slides").find(likeItDOM);
     if(liked=="true"){
        likeItOb.html("You like it");
        likeItOb.click(function(){
          $.ajax({type:"GET", url:"/csrfToken"}).done(function(e){
            $.post("/picture/unlike", {author:author, name:name, _csrf: e._csrf}, function(ans){
             console.log(ans);
              if(ans.msg=="deleted"){
                link.setAttribute('data-likes',Number(likes)-1);
                likesOB.html(Number(likes)-1);
                link.setAttribute('data-liked',false);
                likeItOb.html("Like!");
                
              }
            }, "json");  
          }); 
        });
        
      } else {  
        console.log("like");
        likeItOb.click(function(){
          $.ajax({type:"GET", url:"/csrfToken"}).done(function(e){
            $.post("/picture/like", {author:author, name:name, _csrf: e._csrf}, function(ans){
              console.log(ans);
              if(ans.msg=="created"){
                link.setAttribute('data-likes',Number(likes)+1);
                likesOB.html(Number(likes)+1);
                link.setAttribute('data-liked',true);
                likeItOb.html("You like it");
              }
            }, "json");  
          }); 
        });
      }
      //var desc = this.list[index].getAttribute('data-description');
     // console.log(desc); //your unique id*/
   })


                  
});


