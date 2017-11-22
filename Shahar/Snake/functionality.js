
var snakeSize = 10;
var currDirection;
var snake;
var gameloop;
var direction_flag;

var canvas_height= 40;
var canvas_width= 50;
var score = 0;
var high_score = 2;
var game_running = false;
var count_steps = 0;
var currentSpeed = 100;

var reverse = false;

var blue_snake = {
    head:"blue",
    body:"lightblue"
}

var yellow_snake = {
    head:"orange",
    body:"yellow"
}

var food = {
    x: (canvas_width/2)-1,
    y: (canvas_height/2)-1,
    color : {
        fill:"green",
        border:"lightgreen"
    }
};

var tail = {
    location:0,
    direction:'left'
}

var bonus = {
    x: -1,
    y: -1,
    // x: (canvas_width/2)-4,
    // y: (canvas_height/2)-4,
    on_map : true,
    color : {
        fill:"red",
        border:"orange"
    }
}
var snake_color = yellow_snake;
var init_length = 6;
var head;

//The main function which runs everything
function init(){    
    gameArea.start();
    snake = mySnake();
    init_keyboard();
    head = init_length-1;
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
    gameloop = setInterval(function (){step()}, currentSpeed);
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
            escalate_speed();
            clearInterval(gameloop);
            gameloop = setInterval(function (){step()}, currentSpeed);
            //every 5 foods, a bonus is distributed
            if(score%2 == 0 && !bonus.on_map){
                throw_bonus();
            }
            return;
        }
    }
}

//creates bonus at a random place
function throw_bonus(){
    while(true){
        let x = getRandomInt(0, canvas_width);
        let y = getRandomInt(0, canvas_height);
        if(!onSnake(x,y) && (bonus.x != food.x || bonus.y != food.y)){
            //put bonus
            bonus.x = x;
            bonus.y = y;
            bonus.on_map = true;
            console.log("bonus at: " + food.x + "," + food.y);
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
    if(head == snake.length-1){
        for(let i = 0 ; i < head ; i++){
            if(snake[i].x == x && snake[i].y == y)
                {
                    return true;
                }
        }
    }
    else{
        for(let i = head ; i > 0; i--){
            if(snake[i].x == x && snake[i].y == y)
                {
                    return true;
                }
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
    for(let i = 0 ; i < init_length ; i++){
        array.push({x:i, y:0});
    }
    printSnake(array);
    return array;
}

//the important function which prints the current position of the snake on the canvas
function fillBoard(array){
    //console.log("FILLBOARD");
    var ctx = gameArea.context;
    ctx.clearRect(0, 0, canvas_width*snakeSize,canvas_height*snakeSize);
    ctx.fillStyle = snake_color.body;
    ctx.strokeStyle = snake_color.head;
    ctx.fillRect(0, 0, 0, 0);
    ctx.strokeRect(0, 0, 0, 0);


    //GAME OVER
    if(array[head].x > canvas_width-1 || array[head].x < 0 ||
         array[head].y > canvas_height-1 || array[head].y < 0
       || onSnakeBody(array[head].x, array[head].y)){

        console.log("DEAD!! (" + array[head].x + "," + array[head].y + ")");
        ctx.fillStyle = "red";
        ctx.fillRect(array[head].x*snakeSize, array[head].y*snakeSize, snakeSize, snakeSize);
        ctx.strokeRect(array[head].x*snakeSize, array[head].y*snakeSize, snakeSize, snakeSize);
        gameloop = clearInterval(gameloop);
        if(score > high_score){
            high_score = score;
            console.log("HIGH SCORE: " + high_score);
        }
        game_running = false;
    }
    //paint snake body
    if(head == 0){
        for(let i = array.length-1 ; i > 0 ; i--){
            ctx.fillRect(array[i].x*snakeSize, array[i].y*snakeSize, snakeSize, snakeSize);
            ctx.strokeRect(array[i].x*snakeSize, array[i].y*snakeSize, snakeSize, snakeSize);
        }
    }else{
        for(let i = 0 ; i < array.length-1 ; i++){
            ctx.fillRect(array[i].x*snakeSize, array[i].y*snakeSize, snakeSize, snakeSize);
            ctx.strokeRect(array[i].x*snakeSize, array[i].y*snakeSize, snakeSize, snakeSize);
        }
    }


    //paint dots on the body
    ctx.fillStyle = snake_color.head;
    for(let i = 0 ; i < array.length-1 ; i++){
        ctx.fillRect(array[i].x*snakeSize + snakeSize/2 -1, array[i].y*snakeSize + snakeSize/2 -1, 2, 2);
        ctx.strokeRect(array[i].x*snakeSize, array[i].y*snakeSize, snakeSize, snakeSize);
    }

    //paint head in different color
    ctx.fillStyle = snake_color.head;
    ctx.fillRect(array[head].x*snakeSize, array[head].y*snakeSize, snakeSize, snakeSize);
    ctx.strokeRect(array[head].x*snakeSize, array[head].y*snakeSize, snakeSize, snakeSize);

    //paint the food
    if(count_steps%2 == 0){
        ctx.strokeStyle = food.color.border;
    }
    ctx.fillStyle = food.color.fill;
    ctx.fillRect(food.x*snakeSize, food.y*snakeSize, snakeSize, snakeSize);
    ctx.strokeRect(food.x*snakeSize, food.y*snakeSize, snakeSize, snakeSize);

    // //paint the bonus
    if(bonus.on_map){
        if(count_steps%2 == 0){
            ctx.strokeStyle = bonus.color.border;
        }
        ctx.fillStyle = bonus.color.fill;
        ctx.fillRect(bonus.x*snakeSize, bonus.y*snakeSize, snakeSize, snakeSize);
        ctx.strokeRect(bonus.x*snakeSize, bonus.y*snakeSize, snakeSize, snakeSize);
    }

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
        if(!reverse){
            head++;
        }
    }

    //if the snake has eaten the bonus
    if(onSnake(bonus.x, bonus.y) && bonus.on_map){
        console.log("***CANGING DIRECTION!")
        change_direction();
        reverse = !reverse;
        bonus.on_map = false;
    }
}


//used for getting a random location for the food. returns an integer in range
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}


//console print
function printSnake(snake){
    console.log("PRINTING SNAKE!");
    let str = "";
    for(let i = 0 ; i < snake.length ; i++){
        str+="[" +  snake[i].x + "," + snake[i].y + "]";
    }
    console.log(str);

}

//speed escalated every time a food is eaten, to a point.
function escalate_speed(){
    if(currentSpeed > 70){
        currentSpeed-=1;
    }
}


//For the bonus
function change_direction(){
    head = (head == 0 ? snake.length-1 : 0);
    let temp = {};
    Object.assign(snake[snake.length-1-head], temp);
    Object.assign(snake[head], snake[snake.length-1-head]);
    Object.assign(temp, snake[head]);
    
    console.log("head changed to: " + head);
    switch(currDirection){
        case 'right':
            currDirection = 'left';
            direction_flag = 'left';
            break;
        case 'left':
            currDirection = 'right';
            direction_flag = 'right';
            break;
        case 'up':
            currDirection = 'down';
            direction_flag = 'down';
            break;
        case 'down':
            currDirection = 'up';
            direction_flag = 'up';
            break;
        }
}



