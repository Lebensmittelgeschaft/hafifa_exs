
var snakeSize = 10;
var currDirection;
var snake;
var gameloop;
var direction_flag;
var food = {
    x: 25,
    y:12
};
var canvas_height= 40;
var canvas_width= 50;
var score = 0;
var high_score = 2;
var game_running = false;
var count_steps = 0;


//The main function which runs everything
function init(){    
    gameArea.start();
    snake = mySnake();
    init_keyboard();
    currDirection = 'right';
    direction_flag = 'right';
    score = 0;
    document.getElementById("score").innerHTML = score;
    document.getElementById("high_score").innerHTML = "";
    document.getElementById("curr_high_score").innerHTML = high_score;
    step();
}

function start_game(){
    console.log("starting game!"); 
    gameloop = setInterval(function (){step()}, 100);
}

//creates an event listener that checks the keyboard directions entered by the user
function init_keyboard(){
    window.addEventListener('keydown', function(event) {
        switch (event.keyCode) {
            case 13:
                if(game_running == false){
                    init();
                    start_game();
                    game_running = true;
                }
                break;
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
        
        this.canvas.width = canvas_width*snakeSize;
        this.canvas.height = canvas_height*snakeSize;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[4]);
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
    count_steps++;
}

//creates food at a random place
function throwFood(){
    while(true){
        let x = getRandomInt(0, canvas_width);
        let y = getRandomInt(0, canvas_height);
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

//checks if a point on the board is located on the snake body (without the head).
function onSnakeBody(x,y){
    for(let i = 0 ; i < snake.length-1 ; i++){
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
    
    var array = [];
    for(let i = -1 ; i < 2 ; i++){
        array.push({x:i, y:0});
    }
    printSnake(array);
    return array;
}

//the important function which prints the current position of the snake on the canvas
function fillBoard(array){
    console.log("FILLBOARD");
    var ctx = gameArea.context;
    //console.log(ctx.width + "," + ctx.height);
    ctx.clearRect(0, 0, canvas_width*snakeSize,canvas_height*snakeSize);
    ctx.fillStyle = "lightblue";
        //console.log("array[i].x"+array[i].x);
    ctx.strokeStyle = "blue";
    ctx.fillRect(0, 0, 0, 0);
    ctx.strokeRect(0, 0, 0, 0);


    //GAME OVER
    if(array[array.length-1].x > canvas_width-1 || array[array.length-1].x < 0 ||
         array[array.length-1].y > canvas_height-1 || array[array.length-1].y < 0
        || onSnakeBody(array[array.length-1].x, array[array.length-1].y)){
        console.log("DEAD!! (" + array[array.length-1].x + "," + array[array.length-1].y + ")");
        ctx.fillStyle = "red";
        ctx.fillRect(array[array.length-1].x*snakeSize, array[array.length-1].y*snakeSize, snakeSize, snakeSize);
        ctx.strokeRect(array[array.length-1].x*snakeSize, array[array.length-1].y*snakeSize, snakeSize, snakeSize);
        gameloop = clearInterval(gameloop);
        if(score > high_score){
            high_score = score;
            console.log("HIGH SCORE: " + high_score);
        }
        game_running = false;
    }
    //paint snake body
    for(let i = 0 ; i < array.length-1 ; i++){
        ctx.fillRect(array[i].x*snakeSize, array[i].y*snakeSize, snakeSize, snakeSize);
        ctx.strokeRect(array[i].x*snakeSize, array[i].y*snakeSize, snakeSize, snakeSize);
    }

    //paint dots on the body
    ctx.fillStyle = "blue";
    for(let i = 0 ; i < array.length-1 ; i++){
        ctx.fillRect(array[i].x*snakeSize + snakeSize/2 -1, array[i].y*snakeSize + snakeSize/2 -1, 2, 2);
        ctx.strokeRect(array[i].x*snakeSize, array[i].y*snakeSize, snakeSize, snakeSize);
    }

    //paint head in different color
    ctx.fillStyle = "blue";
    ctx.fillRect(array[array.length-1].x*snakeSize, array[array.length-1].y*snakeSize, snakeSize, snakeSize);
    ctx.strokeRect(array[array.length-1].x*snakeSize, array[array.length-1].y*snakeSize, snakeSize, snakeSize);

    //paint the food
    if(count_steps%2 == 0){
        ctx.strokeStyle = "lightgreen";
    }
    ctx.fillStyle = "green";
    ctx.fillRect(food.x*snakeSize, food.y*snakeSize, snakeSize, snakeSize);
    ctx.strokeRect(food.x*snakeSize, food.y*snakeSize, snakeSize, snakeSize);

    if(score > high_score && (count_steps % 8 < 4 )){
        document.getElementById("high_score").innerHTML = "A NEW HIGH SCORE!!";
    }else{
        document.getElementById("high_score").innerHTML = "";
        }
    //if the snake has eaten the food
    if(onSnake(food.x, food.y)){
        array.push({x:array[array.length-1].x, y:array[array.length-1].y})
        throwFood();
        score++;
        document.getElementById("score").innerHTML = score;
    }
}


//used for getting a random location for the food. returns an integer in range
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}


function printSnake(snake){
    console.log("PRINTING SNAKE!");
    let str = "";
    for(let i = 0 ; i < snake.length ; i++){
        str+="[" +  snake[i].x + "," + snake[i].y + "]";
    }
    console.log(str);

}