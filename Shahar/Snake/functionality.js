
var snakeSize = 10;
var currDirection = 'right';
var snake;
var gameloop;
var direction_flag = 'right';
var food = {
    x: 25,
    y:25
};

//The main function which runs everything
function start_game(){
    console.log("starting game!");  
    gameArea.start();
    snake = mySnake();
    console.log("snake sent: " + snake);
    init_keyboard();
    gameloop = setInterval(function (){step()}, 100);
}



//creates an event listener that checks the keyboard directions entered by the user
function init_keyboard(){
    window.addEventListener('keydown', function(event) {
        switch (event.keyCode) {
            case 37: // Left
                if(direction_flag != 'right')
                    currDirection = 'left';
            break;
            case 38: // Up
                if(direction_flag != 'down')
                currDirection = 'up';
            break;
            case 39: // Right
                if(direction_flag != 'left')
                currDirection = 'right';
            break;
            case 40: // Down
                if(direction_flag != 'up')
                currDirection = 'down';
            break;
        }
    }, false);
}

//creates the canvas of the game
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


//Every step starts here. we check the direction of the snake and 
//move it in this direction.
function step(){

    console.log("currDirection: " + currDirection);
    updateSnake(snake);
    if(currDirection == 'right'){
        snake[snake.length-1].x++;
        direction_flag = 'right';
    }
    if(currDirection == 'down'){
        snake[snake.length-1].y++;
        direction_flag = 'down';
    }
    if(currDirection == 'left'){
        snake[snake.length-1].x--;
        direction_flag = 'left';
    }
    if(currDirection == 'up'){
        snake[snake.length-1].y--;
        direction_flag = 'up';
    }
        fillBoard(snake);
}

//creates food at a random place
function throwFood(){
    while(true){
        let x = getRandomInt(0, 50);
        let y = getRandomInt(0, 50);
        if(!onSnake(x,y)){
            //put food
            food.x = x;
            food.y = y;
            console.log("food at: " + food.x + "," + food.y);
            return;
        }
    }
}

//checks if a point on the board is located on the snake.
function onSnake(x, y){
    for(let i = 0 ; i < snake.length ; i++){
        if(snake[i].x == x && snake[i].y == y)
            {
                return true;
            }
    }
    return false;
}

//moves the array representing the snake foreward
function updateSnake(snake){
    for(let i = 0 ; i < snake.length-1 ; i++){
        Object.assign(snake[i], snake[i+1]);
    }
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

//the important function which prints the current position of the snake on the canvas
function fillBoard(array){
    console.log("FILLBOARD");
    var ctx = gameArea.context;
    //console.log(ctx.width + "," + ctx.height);
    ctx.clearRect(0, 0, 500, 500);
    ctx.fillStyle = "blue";
        //console.log("array[i].x"+array[i].x);
    ctx.strokeStyle = "lightblue";
    ctx.fillRect(100, 100, 0, 0);
    ctx.strokeRect(0, 0, 0, 0);

    //array.shift();
    //console.log("the array: ");
    console.log(snake);

    for(let i = 0 ; i < array.length ; i++){
        //console.log("array[i].x"+array[i].x);
        ctx.fillRect(array[i].x*snakeSize, array[i].y*snakeSize, snakeSize, snakeSize);
        ctx.strokeRect(array[i].x*snakeSize, array[i].y*snakeSize, snakeSize, snakeSize);
    }
    ctx.fillStyle = "green";
    ctx.fillRect(food.x*snakeSize, food.y*snakeSize, snakeSize, snakeSize);
    ctx.strokeRect(food.x*snakeSize, food.y*snakeSize, snakeSize, snakeSize);

    if(onSnake(food.x, food.y)){
        //array.push({x:array[array.length-1].x, y:array[array.length-1].y})
        throwFood();

    }

    if(array[array.length-1].x > 48 || array[array.length-1].x < 0 || array[array.length-1].y > 48 || array[array.length-1].y < 0){
        console.log("DEAD!!");
        gameloop = clearInterval(gameloop);
    }else{
        console.log("ALIVE!!");

    }
}


//used for getting a random location for the food. returns an integer in range
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

