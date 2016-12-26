window.onload = function start (){
  var submit = document.getElementById("hello");
  console.log(submit);
  submit.addEventListener("click", function(){
    
    var context = document.getElementById("myCanvas").getContext('2d');
      context.width = context.width;
      context.height = context.height;
    context.clearRect(0, 0, context.width, context.height);
     var identifier = document.getElementById("identifier").value;
     var code = document.getElementById("code").value;
      console.log(identifier);
      console.log(code);
    
      process(code,identifier)
  });;
}