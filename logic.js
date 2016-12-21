<html>
  
</html>

var ProgressStage = {
  OPENBRACKET: 1, //(
  CONSTRUCTOR: 2, //MAKE-
  IDENTIFIER: 3, //NODE 
  ARGUMENTS: 4, //VAL KEY LEFT RIGHT
  CLOSEBRACKET: 5 
}

function process(block){
  
  for (var i = 0, s = block.length; i < s; i++){
    var c = block[i];
    var thisProcessStage = ProgressStage.OPENBRACKET;
    var constructor = "";
    var identifier = "";
    
    swith(thisProcessStage){
      case ProgressStage.OPENBRACKET:
        if (c == " "){
          continue;
        } else if (c == "("){
          thisProcessstage = ProgressStage.CONSTRUCTOR;
        }
        break;
      
      case ProgressStage.CONSTRUCTOR:
        if (c == " "){
          continue;
        } else if (operator == "make-"){
          thisProcessStage = ProgressStage.IDENTIFIER;
        } else if (operator.length > 5){
          throw "Error: not a constructor";
        } else {
            operator += c;
        }
      
      case ProgressStage.IDENTIFER:
        if (c == " "){
          thisProcessStage = ProgressStage.ARGUMENTS;
        } else if (c == ")"){
          throw "Error: Syntax / No Arguments Found";
        } else {
          identifier += c;  
        }
          
    }
    }
    
  }
}