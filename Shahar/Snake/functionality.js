//© All rights reserved to Shahar Yair, under Sapir unit.
//Mentors: J&A
//PortalSnake game in js 

const SNAKE_SIZE = 10;
const STARTING_SPEED = 80;
const MIN_SPEED = 50;
const CANVAS_HEIGHT = 30;
const CANVAS_WIDTH = 50;
const COLOR_CHANGE = 15;
const INIT_LENGTH = 6;
const OFF_CANVAS = -1;

const RIGHT = {
  name: 'right',
  RL: 1,
  UD: 0
};
const LEFT = {
  name: 'left',
  RL: -1,
  UD: 0
};
const UP = {
  name: 'up',
  RL: 0,
  UD: -1
};
const DOWN = {
  name: 'down',
  RL: 0,
  UD: 1
};

const directions_array = [RIGHT, UP, LEFT, DOWN];


var curr_direction;
var snake;
var gameLoop;
var direction_flag;
var score = 0;
var game_running = false;
var count_steps = 0;
var currentSpeed;
var super_counter = 0;
var high_score_announcer = 30;

var AI_running = false;


var super_food = {
  x: OFF_CANVAS,
  y: OFF_CANVAS,
  color: {
    first: "#ff3232",   //bright red
    second: "#ff0000"   //red
  }
};

const BLUE_SNAKE = {
  head: "blue",
  body: "lightblue"
};

const YELLOW_SNAKE = {
  head: "orange",
  body: "yellow"
};

const GREEN_SNAKE = {
  head: "green",
  body: "lightgreen"
};

const RED_SNAKE = {
  head: "red",
  body: "orange"
};

const PURPLE_SNAKE = {
  head: "purple",
  body: "pink"
};

const BLACK_SNAKE = {
  head: "black",
  body: "grey"  
};

const SNAKE_COLOR_ARRAY = [YELLOW_SNAKE, GREEN_SNAKE, BLUE_SNAKE, RED_SNAKE, PURPLE_SNAKE, BLACK_SNAKE];

function get_snake_color(){
  let index = parseInt((score/(COLOR_CHANGE)),10)%(COLOR_CHANGE*SNAKE_COLOR_ARRAY.length);
  snake_color = SNAKE_COLOR_ARRAY[index];
}


var food = {
  x: (CANVAS_WIDTH / 2) - 1,
  y: (CANVAS_HEIGHT / 2) - 1,
  color: {
    fill: "green",
    border: "lightgreen"
  }
};

var portals = {
  p1: {
    color: "#9975b9",//bright purple
    x: OFF_CANVAS,
    y: OFF_CANVAS
  },
  p2: {
    color: "lightblue",
    x: OFF_CANVAS,
    y: OFF_CANVAS
  },
  on_map: false
};

var snake_color = SNAKE_COLOR_ARRAY[0];
var head;

//The main function which runs everything
function init() {
  if (game_running) {
    return;
  }
  gameArea.start();
  gameArea.canvas.setAttribute('style', "position: absolute;  left: 50%;margin-left:-400px; top: 15%; border:2px solid black");
  snake = mySnake();
  init_keyboard();
  head = INIT_LENGTH - 1;
  curr_direction = RIGHT.name;
  direction_flag = RIGHT.name;
  score = 0;
  document.getElementById("score").innerHTML = score;
  document.getElementById("high_score").innerHTML = " ";
  document.getElementById("curr_high_score").innerHTML = localStorage.high_score;
  step();
}

function start_game() {
  console.log("starting game!");
  if (!localStorage.high_score) {
    localStorage.high_score = 1;
  }
  currentSpeed = STARTING_SPEED;
  high_score_announcer = 30;
  gameLoop = setInterval(function () { step() }, currentSpeed);
}

//creates an event listener that checks the keyboard directions entered by the user
function init_keyboard() {
  window.addEventListener('keydown', function (event) {
    switch (event.keyCode) {
      case 13:    //enter
        if (game_running == false) {
          init();
          start_game();
          game_running = true;
        }
        break;
      case 37: // Left
        if (direction_flag != RIGHT.name)
          curr_direction = LEFT.name;
        break;
      case 38: // Up
        if (direction_flag != DOWN.name)
          curr_direction = UP.name;
        break;
      case 39: // Right
        if (direction_flag != LEFT.name)
          curr_direction = RIGHT.name;
        break;
      case 40: // Down
        if (direction_flag != UP.name)
          curr_direction = DOWN.name;
        break;
    }
  }, false);
}

//creates the canvas of the game
var gameArea = {
  canvas: document.createElement("canvas"),
  //context : this.canvas.getContext("2d"),
  start: function () {
    this.canvas.width = CANVAS_WIDTH * SNAKE_SIZE;
    this.canvas.height = CANVAS_HEIGHT * SNAKE_SIZE;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[3]);
  }
}


//Every step starts here. we check the direction of the snake and 
//move it in this direction.
function step() {
  if (AI_running) {
    run_AI();
  }
  update_snake(snake);
  if (curr_direction == RIGHT.name) {
    snake[snake.length - 1].x++;
    direction_flag = RIGHT.name;
  }
  if (curr_direction == DOWN.name) {
    snake[snake.length - 1].y++;
    direction_flag = DOWN.name;
  }
  if (curr_direction == LEFT.name) {
    snake[snake.length - 1].x--;
    direction_flag = LEFT.name;
  }
  if (curr_direction == UP.name) {
    snake[snake.length - 1].y--;
    direction_flag = UP.name;
  }
  fillBoard(snake);
  count_steps++;


}

//creates food at a random place
function throw_food() {
  let point = get_random_empty_point();
  food.x = point.x;
  food.y = point.y;
  escalate_speed();
  clearInterval(gameLoop);
  gameLoop = setInterval(function () { step() }, currentSpeed);
  //every 3 foods, open portal
  if (score % 3 == 0) {
    throw_portals();
  }
  if (super_counter <= 0 && (get_random_int(0, 11) % 2 == 0)) {
    throw_super();
    super_counter = 50;
    super_food.on_map = true;
  }
  return;
}


function get_random_empty_point() {
  while (true) {
    let x = get_random_int(0, CANVAS_WIDTH);
    let y = get_random_int(0, CANVAS_HEIGHT);
    if (is_empty_cell(x, y)) {
      return { x: x, y: y };
    }
  }
}


function throw_portals() {
  let point1 = get_random_empty_point();
  let point2 = get_random_empty_point();
  portals.p1.x = point1.x;
  portals.p1.y = point1.y;
  portals.p2.x = point2.x;
  portals.p2.y = point2.y;
  portals.on_map = true;
  return;
}

function throw_super() {
  let point = get_random_empty_point();
  super_food.x = point.x;
  super_food.y = point.y;
}

//checks if a point on the board is located on the snake.
function is_on_snake(x, y) {
  for (let i = 0; i < snake.length; i++) {
    if (snake[i].x == x && snake[i].y == y) {
      return true;
    }
  }
  return false;
}

//checks if a point on the board is located on the snake body (without the head).
function is_on_snakeBody(x, y) {
  for (let i = 0; i < head; i++) {
    if (snake[i].x == x && snake[i].y == y) {
      return true;
    }
  }
  return false;

}

//moves the array representing the snake foreward
function update_snake(snake) {
  for (let i = 0; i < snake.length - 1; i++) {
    Object.assign(snake[i], snake[i + 1]);
  }
}

//initiate my snake.
function mySnake() {
  var array = [];
  for (let i = 0; i < INIT_LENGTH; i++) {
    array.push({ x: i, y: 0 });
  }
  print_snake(array);
  return array;
}

//the important function which prints the current position of the snake on the canvas
function fillBoard(array) {
  //console.log("FILLBOARD");
  var ctx = gameArea.context;
  ctx.clearRect(0, 0, CANVAS_WIDTH * SNAKE_SIZE, CANVAS_HEIGHT * SNAKE_SIZE);
  ctx.fillStyle = snake_color.body;
  ctx.strokeStyle = snake_color.head;
  ctx.fillRect(0, 0, 0, 0);
  ctx.strokeRect(0, 0, 0, 0);

  check_game_over(ctx, array);

  //snake changes color by score!
  get_snake_color();

  //paint snake body
  if (head == 0) {
    for (let i = array.length - 1; i > 0; i--) {
      paint_cell(ctx, array[i].x, array[i].y);
    }
  } else {
    for (let i = 0; i < array.length - 1; i++) {
      paint_cell(ctx, array[i].x, array[i].y);
    }
  }

  //paint dots on the body
  ctx.fillStyle = snake_color.head;
  for (let i = 0; i < array.length - 1; i++) {
    ctx.fillRect(array[i].x * SNAKE_SIZE + SNAKE_SIZE / 2 - 1, array[i].y * SNAKE_SIZE + SNAKE_SIZE / 2 - 1, 2, 2);
    ctx.strokeRect(array[i].x * SNAKE_SIZE, array[i].y * SNAKE_SIZE, SNAKE_SIZE, SNAKE_SIZE);
  }

  //paint head in different color
  ctx.fillStyle = snake_color.head;
  paint_cell(ctx, array[head].x, array[head].y);

  //paint the food
  ctx.strokeStyle = "lightgreen";
  ctx.fillStyle = food.color.fill;
  paint_cell(ctx, food.x, food.y);

  //print portals
  if (count_steps % 2 == 0) {
    ctx.strokeStyle = food.color.border;
  } else {
    ctx.strokeStyle = "orange";
  }
  if (portals.on_map) {
    ctx.fillStyle = portals.p1.color;
    paint_cell(ctx, portals.p1.x, portals.p1.y);
    ctx.fillStyle = portals.p2.color;
    paint_cell(ctx, portals.p2.x, portals.p2.y);
  }

  //paint super food
  if (super_food.on_map) {
    if (count_steps % 2 == 0) {
      ctx.fillStyle = super_food.color.first;
    } else {
      ctx.fillStyle = super_food.color.second;
    }
    paint_cell(ctx, super_food.x, super_food.y);
    super_counter--;
    if (super_counter < 0) {
      super_food.on_map = false;
    }
  }
  if (count_steps % 500 == 0) {
    throw_portals();
  }

  //check a new high score
  check_high_score(array);

  //if the snake has eaten something or entered a portal
  check_special_occurences(array);

}


//used for getting a random location for the food. returns an integer in range
function get_random_int(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}


//FOR DEBUGGING
function print_snake(snake) {
  console.log("PRINTING SNAKE!");
  let str = "";
  for (let i = 0; i < snake.length; i++) {
    str += "[" + snake[i].x + "," + snake[i].y + "]";
  }
  console.log(str);

}

//speed escalated every time a food is eaten, to a point.
function escalate_speed() {
  if (currentSpeed > MIN_SPEED) {
    currentSpeed -= 2;
  }
}

function paint_cell(ctx, x, y) {
  ctx.fillRect(x * SNAKE_SIZE, y * SNAKE_SIZE, SNAKE_SIZE, SNAKE_SIZE);
  ctx.strokeRect(x * SNAKE_SIZE, y * SNAKE_SIZE, SNAKE_SIZE, SNAKE_SIZE);
}


function is_empty_cell(x, y) {
  if (!(x = food.x && y == food.y) && !is_obsticle(x, y)) {
    return true;
  }

  return false;
}

function is_obsticle(x, y) {
  if ((!is_on_snake(x, y)) && (x >= 0 && x <= CANVAS_WIDTH) && (y >= 0 && y <= CANVAS_HEIGHT)) {
    return false;
  }

  return true;
}

//The AI of the snake!
//its really dumb and not really an AI, just a lot of conditions to to avoid being overly stupid.
function run_AI() {
  //food is on my right
  if (snake[head].x < food.x) {
    check_direction(0);
  }
  //food is above me
  else if (snake[head].y > food.y) {
    check_direction(1);
  }
  //food is on my left
  else if (snake[head].x > food.x) {
    check_direction(2);
  }
  //food is below me
  else if (snake[head].y < food.y) {
    check_direction(3);
  } else {
    console.log("IMPOSSIBLE!");
  }
}

function check_direction(j) {
  for (let i = 0; i < 4; i++) {
    //console.log(directions_array[(i + j) % 4].RL + "," + directions_array[(i + j) % 4].UD);
    if (!is_obsticle(snake[head].x + directions_array[(i + j) % 4].RL, snake[head].y + directions_array[(i + j) % 4].UD)
      && curr_direction != directions_array[(i + j + 2) % 4]) {
      curr_direction = directions_array[(i + j) % 4].name;
      //console.log(directions_array[(i + j) % 4].name);
      return;
    }
  }
  console.log("STUCK!");
  return;
}

function take_over() {
  AI_running = !AI_running;
}

function check_game_over(ctx, array) {
  if (array[head].x > CANVAS_WIDTH - 1 || array[head].x < 0 ||
    array[head].y > CANVAS_HEIGHT - 1 || array[head].y < 0
    || is_on_snakeBody(array[head].x, array[head].y)) {

    console.log("DEAD!! (" + array[head].x + "," + array[head].y + ")");
    if (snake_color == RED_SNAKE) {
      ctx.fillStyle = "purple"
    } else {
      ctx.fillStyle = "red";
    }

    paint_cell(ctx, array[head].x, array[head].y);
    gameLoop = clearInterval(gameLoop);
    if (score > localStorage.high_score) {
      localStorage.high_score = score;
      console.log("HIGH SCORE: " + localStorage.high_score);
    }
    game_running = false;
    print_snake(array);
  }
}

function check_high_score(array){
  if (high_score_announcer > 0) {
    if (score > localStorage.high_score && (count_steps % 8 < 4)) {
      document.getElementById("high_score").innerHTML = "A NEW HIGH SCORE!!";
      high_score_announcer--;
    } else {
      document.getElementById("high_score").innerHTML = ". ";
    }
  } else {
    document.getElementById("high_score").innerHTML = "A NEW HIGH SCORE!!";
  }
}


function check_special_occurences(array){
  //if the snake has eaten the food
  if (is_on_snake(food.x, food.y)) {
    array.push({ x: array[array.length - 1].x, y: array[array.length - 1].y })
    throw_food();
    score++;
    document.getElementById("score").innerHTML = score;
    head++;
  }

  //if the snake has eaten the super food
  if (is_on_snake(super_food.x, super_food.y) && super_food.on_map) {
    for (let i = 0; i < 3; i++) {
      array.push({ x: array[array.length - 1].x, y: array[array.length - 1].y })
    }
    score += 3;
    currentSpeed = ((currentSpeed < MIN_SPEED) ? MIN_SPEED : currentSpeed - 3);
    document.getElementById("score").innerHTML = score;
    head += 3;
    super_counter = 0;
    super_food.on_map = false;
  }

  //if the snake has entered a portal
  if (snake[head].x == portals.p1.x && snake[head].y == portals.p1.y) {
    snake[head].x = portals.p2.x;
    snake[head].y = portals.p2.y;
  } else if (snake[head].x == portals.p2.x && snake[head].y == portals.p2.y) {
    snake[head].x = portals.p1.x;
    snake[head].y = portals.p1.y;
  }

}