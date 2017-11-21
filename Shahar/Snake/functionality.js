
var snakeSize = 10;
var currDirection = 'right';
var snake;
var gameloop;


function start_game(){
    console.log("starting game!");
    
    gameArea.start();
    snake = mySnake();
    console.log("snake sent: " + snake);
    init_keyboard();
    gameloop = setInterval(function (){step()}, 100);
}




function init_keyboard(){
    window.addEventListener('keydown', function(event) {
    switch (event.keyCode) {
    case 37: // Left
      currDirection = 'left';
    break;

    case 38: // Up
      currDirection = 'up';
    break;

    case 39: // Right
      currDirection = 'right';
    break;

    case 40: // Down
      currDirection = 'down';
    break;
  }
}, false);

}
var gameArea = {
    canvas : document.createElement("canvas"),
    //context : this.canvas.getContext("2d"),
    start : function(){
        this.canvas.width = 500;
        this.canvas.height = 500;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    }
}

function step(){
    //console.log("step. my snake: " + snake);
    //console.log(snake);
    var headX = snake[snake.length-1].x; 
    var headY = snake[snake.length-1].y; 
    console.log("currDirection: " + currDirection);
    updateSnake(snake);
    if(currDirection == 'right'){
        snake[snake.length-1].x++;
    }
    if(currDirection == 'down'){
        snake[snake.length-1].y++;
    }
    if(currDirection == 'left'){
        snake[snake.length-1].x--;
    }
    if(currDirection == 'up'){
        snake[snake.length-1].y--;
    }
    //console.log("end of step:");
    //console.log(snake);

    //for (var i = 0; i < snake.length; i++) {
        fillBoard(snake);
    //}

}

function updateSnake(snake){
    //console.log(snake);
    for(let i = 0 ; i < snake.length-1 ; i++){
    //console.log(i + " " +snake[i].y + "=" + snake[i+1].y);
        Object.assign(snake[i], snake[i+1]);
    }
    //console.log(snake);
}

//initiate my snake.
function mySnake(){
    //console.log("mySnake");
    var array = [];
    for(let i = -1 ; i < 4 ; i++){
        array.push({x:i, y:0});
    }
    //fillBoard(array);
    return array;
}

function fillBoard(array){
    console.log("FILLBOARD");
    var ctx = gameArea.context;
    //console.log(ctx.width + "," + ctx.height);
    ctx.clearRect(0, 0, 500, 500);
    ctx.fillStyle = "blue";
        //console.log("array[i].x"+array[i].x);
    ctx.strokeStyle = "lightblue";
    ctx.fillRect(0, 0, 0, 0);
    ctx.strokeRect(0, 0, 0, 0);

    //array.shift();
    //console.log("the array: ");
    console.log(snake);

    for(let i = 0 ; i < array.length ; i++){
        //console.log("array[i].x"+array[i].x);
        ctx.fillRect(array[i].x*snakeSize, array[i].y*snakeSize, snakeSize, snakeSize);
        ctx.strokeRect(array[i].x*snakeSize, array[i].y*snakeSize, snakeSize, snakeSize);
    }
    //gameloop = clearInterval(gameloop);

}