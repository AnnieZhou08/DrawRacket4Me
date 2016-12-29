window.onload = function start (){
  var submit = document.getElementById("hello");
  console.log(submit);
  submit.addEventListener("click", function(){
    
     var identifier = document.getElementById("identifier").value;
     var code = document.getElementById("code").value;
      console.log(identifier);
      console.log(code);
    
     var list = document.getElementById("list");
     var binary = document.getElementById("binary");
    
     var notif = document.getElementById("notification");
    
    if(list.checked && binary.checked){
      throw "Error: cannot check both";
    }else if(binary.checked){
      processFinite(code, identifier);
    }else if(list.checked){
      process(code, identifier);
    }else {
      throw "Error: please select a type";
    }
    
    notif.innerHTML = "See your tree below. Please refresh page to draw a new tree!";
  });
}