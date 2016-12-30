var ProgressStage = {
  OPENBRACKET: 1, //(
  CONSTRUCTOR: 2, //MAKE
  IDENTIFIER: 3, //NODE 
  ARGUMENTS: 4, //VAL KEY LEFT RIGHT
  CLOSEBRACKET: 5 //)
}

function process(block, identity){
  
  var thisProcessStage = ProgressStage.OPENBRACKET;
  var constructor = "";
  var identifier = "";
  var arguments = []; 
  var currentArgument = 0;
  var numOpenBrackets = 0;
  var hadSpace = false;
  var path = []; path.push(-1);
  var layer = 0;
  var alreadyClosed = true; //brackets for (list and (make-node form an even and odd parity; thus we need a boolean to toggle parity values
  var addedLayer = false;
  
  for (var i = 0, s = block.length; i < s; i++){
    var c = block[i];
    
    switch(thisProcessStage){
      case ProgressStage.OPENBRACKET:
        if (c == " "){
          continue;
        } else if (c != "("){
          throw "Error: Bad Syntax";
        } else {
          numOpenBrackets++;
          thisProcessStage = ProgressStage.CONSTRUCTOR;
        }
        break;
      
      case ProgressStage.CONSTRUCTOR:
        if (c == " " || c == "\n"){
          continue;
        } else if (constructor == "list" || constructor == "'("){
          alreadyClosed = false;
          constructor = "";
          numOpenBrackets++;
          path.push(0);
          addedLayer = true;
          layer++;
        } else if (constructor == "make"){
          alreadyClosed = true;  
          if (addedLayer == false){
              path[layer]=path[layer]+1;
            }
            addedLayer = false;
          thisProcessStage = ProgressStage.IDENTIFIER;
        } else if (constructor.length > 1000){
          throw "Error: not a constructor";
        } else {
            constructor += c;
        }
        break;
      
      case ProgressStage.IDENTIFIER:
        if (c == " "){
          if (identifier == identity){
            thisProcessStage = ProgressStage.ARGUMENTS;
          } else {
            throw "Error: Identifier undefined";
          }
        } else if (c == ")"){
          throw "Error: Syntax / No Arguments Found";
        } else {
          identifier += c;
        }
        break;
        
      case ProgressStage.ARGUMENTS:
        if (arguments.length == currentArgument){
           arguments[currentArgument]="";
        }
        if (c == " " || c == "\n"){
          hadSpace = true;
        } else if (c == ")"){
          numOpenBrackets--;
          if (numOpenBrackets == 0){
            arguments[currentArgument] +="|"+path;
            break;
          } else{
            alreadyClosed = false;
            arguments[currentArgument] += "|" + path + "*" + layer;
            thisProcessStage = ProgressStage.CLOSEBRACKET;
          }
        } else if (c == "("){
          numOpenBrackets++;
          identifier = "";
          constructor = "";
          arguments[currentArgument] +="|"+path+"*"+layer;
          currentArgument++;
          thisProcessStage = ProgressStage.CONSTRUCTOR;
        } else if (c == "'"){
          numOpenBrackets++;
          identifier = "";
          constructor = "'";
          arguments[currentArgument] +="|"+path+"*"+layer;
          currentArgument++;
          thisProcessStage = ProgressStage.CONSTRUCTOR;
        } else{
          if (hadSpace == true && arguments[currentArgument].length!=0){
            arguments[currentArgument] += ","+c;
            hadSpace = false;
          } else {
            arguments[currentArgument] += c;
          }
        }
        break; 
      case ProgressStage.CLOSEBRACKET:
        if (c == ")" && alreadyClosed ==false){
          arguments[currentArgument] += "|" + path + "*" + layer;
          layer--;
          path.pop();
          alreadyClosed = true;
        } else if (c == " "){
          continue;
        } else if (c == "("){
          constructor = "";
          identifier = "";
          currentArgument++;
          thisProcessStage = ProgressStage.CONSTRUCTOR;
        } else if (c==")") {
          alreadyClosed = false;
        }
        break;
    }
  }
  console.log(arguments);
  processArguments(arguments);    
}

function processArguments(arguments){
  var info = [];
  for (var i = 0; i < arguments.length; i++){
    var arg = arguments[i];
    var sliceIndex = arg.indexOf("*");
    var fieldIndex = arg.indexOf("|");
    
    var fields = arg.substr(0,fieldIndex);
    var path = arg.substring(fieldIndex+1,sliceIndex);
    info[i] = new Array (fields, path);
  }
  getSibling (info);
}
  
function getSibling(info){
  for (var j = 0; j < info.length; j++){
    var count = 0;
    var route = info[j][1];
    for (var k = 0; k < info.length; k++){
      if (info[k][1].length == route.length &&
          info[k][1].charAt(info[k][1].length-3) ==
          route.charAt(route.length-3)) {
        count++;
      }
    }
    info[j] = new Array (info[j][0], info[j][1], count, window.innerWidth, window.innerWidth, window.innerHeight);
  }
  info[0][4] /= 2;
  info[0][5] = 30;
  getXYCoordinates(info);
  
}
// Right now, info = Array(data, path, num-of-siblings, width, x-coordinate, y-coordinate); Note that it is also stored in order of descend.
  
function getXYCoordinates(info){
  var height = 0;
  for (var n = 1; n < info.length; n++){
    height = Math.max(height, info[n][1].length);
  }
  height = (height+1)/2; //returns height of tree
  
  var layerHeight = window.innerHeight/height;
  var defaultHeight = 30;
  
  for (var i = 1; i < info.length; i++){
    if (info[i][1].length == info[i-1][1].length+2){
      //meaning this node is the previous nodes' child
      var siblings = info[i][2];
      var index = parseInt(info[i][1].charAt(info[i][1].length-1));
      var layer = (info[i][1].length + 1)/2 - 1;
      var width = info[i-1][3];
      var x_coordinate = info[i-1][4];
      var occupy_width = width/siblings;
      
      var new_x = x_coordinate + (index - siblings/2 + 0.5)*occupy_width;
      
      var y_coordinate = layer * layerHeight + defaultHeight;
      
      info[i][3] = occupy_width;
      info[i][4] = new_x;
      info[i][5] = y_coordinate;
    }else if (info[i][1].length == info[i-1][1].length){ //meaning this node is previous nodes' sibling node
      var index = parseInt(info[i][1].charAt(info[i][1].length-1));
      var layer = (info[i][1].length + 1)/2 - 1;
      var width = info[i-1][3];
      var x_coordinate = info[i-1][4];
      
      var new_x = x_coordinate+width;
      
      var y_coordinate = layer * layerHeight + defaultHeight;
      
      info[i][3] = width;
      info[i][4] = new_x;
      info[i][5] = y_coordinate;
    }else{
      //meaning this layer is done; need to find the nodes' sibling
      for (var j = 1; j < info.length; j++){
        if (info[j][1].length == info[i][1].length &&
            info[j][1].charAt(info[j][1].length-3) ==
            info[i][1].charAt(info[i][1].length-3)){
        var index = parseInt(info[i][1].charAt(info[i][1].length-1));
        var layer = (info[i][1].length + 1)/2 - 1;
        var width = info[j][3];
        var x_coordinate = info[j][4];
          console.log(info[j]);
      
        var new_x = x_coordinate+width;
          
        var y_coordinate = layer * layerHeight + defaultHeight;
      
        info[i][3] = width;
        info[i][4] = new_x;
        info[i][5] = y_coordinate;
          break;
        }
      }
    }
  }
  console.log(info);
  drawTree(info);
}

//lstnodes passed in is an ordered pair of destination x and y values
function drawTree(info){
  var c = document.getElementById("myCanvas");
  var ctx = c.getContext("2d");

  for (var i = 1; i < info.length; i++){
    if (info[i][1].length == info[i-1][1].length+2){
      //the child of previous node
          
      ctx.beginPath();
      ctx.moveTo(info[i-1][4], info[i-1][5]);
      ctx.lineTo(info[i][4], info[i][5]);
      ctx.stroke();
      
    }else {
      //finds the parent of this node (shud be else where)
      for (var j = 0; j < info.length; j++){
        if (info[i][1].length == info[j][1].length+2 && info[i][1].substring(0,info[j][1].length) === info[j][1]){
          //parent is found
          
          ctx.beginPath();
          ctx.moveTo(info[j][4], info[j][5]);
          ctx.lineTo(info[i][4], info[i][5]);
          ctx.stroke();
          break;
        }
      }
    }
  }
  for (var i = 1; i < info.length; i++){
      ctx.beginPath();
      ctx.arc(info[i][4], info[i][5], 20, 0, 2*Math.PI);
      ctx.fillStyle = "white";
      ctx.fill();
      ctx.stroke();
  }
  for (var i = 0; i < info.length; i++){
      var index = info[i][0].indexOf("empty");
      if (index == -1){
        continue;
      }else {
        info[i][0] = info[i][0].substring(0, index-1);
      }
  }
  
  for (var i = 1; i < info.length; i++){
      ctx.font = "18px Times New Roman";
      ctx.fillStyle = "black";
      ctx.textAlign = "center";
      ctx. fillText(info[i][0], info[i][4], info[i][5]);
  }
      ctx.beginPath();
      ctx.arc(info[0][4], info[0][5], 20, 0, 2*Math.PI);
      ctx.fillStyle = "white";
      ctx.fill();
      ctx.stroke();
  
      ctx.font = "18px Times New Roman";
      ctx.fillStyle = "black";
      ctx.textAlign = "center";
      ctx. fillText(info[0][0], info[0][4], info[0][5]);
}

