

//© All rights reserved to Shahar Yair, under Sapir unit.
//Mentors: J&A
//PortalSnake game in js 

var snakeSize = 10;
var currDirection;
var snake;
var gameloop;
var direction_flag;

var canvas_height= 50;
var canvas_width= 60;
var score = 0;
// var high_score = 2;

var game_running = false;
var count_steps = 0;
var currentSpeed = 95;
var super_counter = 0;
var high_score_announcer = 30;
var color_change = 15;


/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {

    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

var super_food = {
    x : -1,
    y: -1,
    color:{ 
        first: "#ff3232",   //bright red
        second: "#ff0000"   //red
    }
}

var reverse = false;

var blue_snake = {
    head:"blue",
    body:"lightblue"
}

var yellow_snake = {
    head:"orange",
    body:"yellow"
}

var green_snake = {
    head:"green",
    body:"lightgreen"
}

var red_snake = {
    head: "red",
    body: "orange"
}

function change_color(clr){
    switch(clr){
        case 'blue':
            snake_color = blue_snake;
            break;
        case 'orange':
            snake_color = yellow_snake;
            break;
        case 'green':
            snake_color = green_snake;
            break;
        case 'red':
            snake_color = red_snake;
            break;
    }
        
    //init();
        
}

var food = {
    x: (canvas_width/2)-1,
    y: (canvas_height/2)-1,
    color : {
        fill:"green",
        border:"lightgreen"
    }
};

var portals = {
    p1:{
        color:"#9975b9",//bright purple
        x: -1,
        y: -1
    },
    p2:{
        color:"lightblue",
        x: -1,
        y: -1
    },
    on_map:false
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
    on_map : false,
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
    //console.log("Three randoms: " + Math.random()  + " " + Math.random() +  " "+ Math.random()  + " ");
    if(game_running){
        return;
    }
    gameArea.start();
    gameArea.canvas.setAttribute('style', "position: absolute;  left: 50%;margin-left:-400px; top: 50%;margin-top:-250px; border:2px solid black");
    snake = mySnake();
    init_keyboard();
    head = init_length-1;
    currDirection = 'right';
    direction_flag = 'right';
    score = 0;
    document.getElementById("score").innerHTML = score;
    document.getElementById("high_score").innerHTML = "";
    document.getElementById("curr_high_score").innerHTML = localStorage.high_score;
    step();
}

function start_game(){
    console.log("starting game!"); 
    if (!localStorage.high_score) {
        localStorage.high_score = 1;
    }
    currentSpeed = 95;
    high_score_announcer = 30;
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
            // case 49: // 1
            //     change_color('blue')
            //     break;
            // case 50: // 2
            //     change_color('orange')
            //     break;
            // case 51: // 3
            //     change_color('green')
            //     break;
            // case 52: // 4
            //     change_color('red')
            //     break;
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
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    }
}


//Every step starts here. we check the direction of the snake and 
//move it in this direction.
function step(){

    //console.log("currDirection: " + currDirection);
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
    let point = get_random_empty_point();
    food.x = point.x;
    food.y = point.y;    
    escalate_speed();
    clearInterval(gameloop);
    gameloop = setInterval(function (){step()}, currentSpeed);
    //every 3 foods, open portal
    if(score%3 == 0){
        throw_portals();
    }
    if(super_counter <= 0 && (getRandomInt(0, 11)%2 == 0)){
        console.log("THROWING SUPER!");
        throw_super();
        super_counter = 50;
        super_food.on_map = true;
    }
    return;
}


function get_random_empty_point(){
    while(true){
        let x = getRandomInt(0, canvas_width);
        let y = getRandomInt(0, canvas_height);
        if(empty_cell(x,y)){
            return {x : x , y : y};
        }
    }
}

//creates bonus at a random place
function throw_bonus(){
    let point = get_random_empty_point();
    //put bonus
    bonus.x = point.x;
    bonus.y = point.y;
    bonus.on_map = true;
    console.log("bonus at: " + food.x + "," + food.y);
    return;
}

function throw_portals(){
    let point1 = get_random_empty_point();
    let point2 = get_random_empty_point();
    portals.p1.x = point1.x;
    portals.p1.y = point1.y;
    portals.p2.x = point2.x;
    portals.p2.y = point2.y;
    portals.on_map = true;
    //console.log("*****portals at: " + x1 + "," + y1 + "<>" + x2 + "," + y2);
    return;
}

function throw_super(){
    let point = get_random_empty_point();
    super_food.x = point.x;
    super_food.y = point.y;
    console.log("SUPER: " + super_food.x + "." + super_food.y);
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
    if(!reverse){
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
        paint_cell(ctx, array[head].x, array[head].y);
        gameloop = clearInterval(gameloop);
        if(score > localStorage.high_score){
            localStorage.high_score = score;
            console.log("HIGH SCORE: " + localStorage.high_score);
        }
        game_running = false;
    }

    //snake changes color by score!
    if(score <= color_change){
        change_color('orange');
    }else if(score > color_change && score <= 2*color_change){
        change_color('green');
    }else if(score > 2*color_change && score <= 3*color_change){
        change_color('blue');
    }else if(score > 3*color_change){
        change_color('red');
    }

    //paint snake body
    if(head == 0){
        for(let i = array.length-1 ; i > 0 ; i--){
            paint_cell(ctx, array[i].x, array[i].y);
        }
    }else{
        for(let i = 0 ; i < array.length-1 ; i++){
            paint_cell(ctx, array[i].x, array[i].y);
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
    paint_cell(ctx, array[head].x, array[head].y);

    //paint the food
    ctx.strokeStyle = "lightgreen";
    ctx.fillStyle = food.color.fill;
    paint_cell(ctx, food.x, food.y);

    //paint the bonus
    if(bonus.on_map){
        if(count_steps%2 == 0){
            ctx.strokeStyle = bonus.color.border;
        }
        ctx.fillStyle = bonus.color.fill;
        paint_cell(ctx, bonus.x, bonus.y);
    }

    
    //print portals
    if(count_steps%2 == 0){
        ctx.strokeStyle = food.color.border;
    }else{
        ctx.strokeStyle = "orange";
    }
    if(portals.on_map){
        ctx.fillStyle = portals.p1.color;
        paint_cell(ctx, portals.p1.x, portals.p1.y);    
        ctx.fillStyle = portals.p2.color;
        paint_cell(ctx, portals.p2.x, portals.p2.y);   
    }

    //paint super food
    if(super_food.on_map){
        if(count_steps%2 == 0){
            ctx.fillStyle = super_food.color.first;   
        }else{
            ctx.fillStyle = super_food.color.second;
        }
        paint_cell(ctx, super_food.x, super_food.y); 
        super_counter--;
        if(super_counter < 0){
            super_food.on_map = false;
        }
    }


    //check a new high score
    if(high_score_announcer > 0){
        if(score > localStorage.high_score && (count_steps % 8 < 4 )){
            document.getElementById("high_score").innerHTML = "A NEW HIGH SCORE!!";
            high_score_announcer--;
        }else{
            document.getElementById("high_score").innerHTML = " ";
        }
        
    }else{
        document.getElementById("high_score").innerHTML = "A NEW HIGH SCORE!!";
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

    if(onSnake(super_food.x, super_food.y) && super_food.on_map){
        for(let i = 0 ; i < 3 ; i++){
            array.push({x:array[array.length-1].x, y:array[array.length-1].y})
        }
        score+=3;
        
        currentSpeed = ((currentSpeed < 73) ? 70 : currentSpeed-3);
        document.getElementById("score").innerHTML = score;
        if(!reverse){
            head+=3;
        }
        super_counter = 0;
        super_food.on_map = false;
    }

    //if the snake has eaten the bonus
    if(onSnake(bonus.x, bonus.y) && bonus.on_map){
        console.log("***CANGING DIRECTION!")
        change_direction();
        reverse = !reverse;
        bonus.on_map = false;
    }

    //if the snake has entered a portal
    if(snake[head].x == portals.p1.x && snake[head].y == portals.p1.y){
        snake[head].x = portals.p2.x;
        snake[head].y = portals.p2.y;
    }else if(snake[head].x == portals.p2.x && snake[head].y == portals.p2.y){
        snake[head].x = portals.p1.x;
        snake[head].y = portals.p1.y;
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

function paint_cell(ctx, x, y){
            ctx.fillRect(x*snakeSize, y*snakeSize, snakeSize, snakeSize);
            ctx.strokeRect(x*snakeSize, y*snakeSize, snakeSize, snakeSize);
}


function empty_cell(x, y){
    if(!(x = food.x && y == food.y) && !(x == bonus.x && y == bonus.y) && (!onSnake(x,y))){
        return true;
    }

    return false;
}
