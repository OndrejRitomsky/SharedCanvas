if (pics){  
  $(document).ready(function(){
    $("#links a").bind("click",function(){
      console.log(this);
      
      var title = this.title;
      var ind = title.indexOf(':');
      var author = title.slice(0,ind);
      var name = title.slice(ind+1,title.length+1);
      console.log(author);
      console.log(name);
      
      $("#mylikes").html(pics[1].likes);
      
    });

  });
                  
}