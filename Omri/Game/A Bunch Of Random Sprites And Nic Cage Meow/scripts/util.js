//Global Primitive Constants
const CANVAS_WIDTH     = 800;
const CANVAS_HEIGHT    = 500;
const GROUND_WIDTH     = 128;
const GROUND_HEIGHT    = 128;
const CHARACTER_HEIGHT = 96;
const CHARACTER_WIDTH  = 96;
const OBSTACLE_HEIGHT  = 64;
const OBSTACLE_WIDTH   = 64;
const CHARACTER_JUMP_HEIGHT = 96;
const BACKGROUND_SPEED = 5;// number of pixels to move the first placed image in each update
const GROUND_SPEED     = 3; //same as BACKGROUND_SPEED
const OBSTACLE_SPEED   = 3; //same as character Speed
const CHARACTER_SPEED  = 3; //describes the speed of the sprite change animation, higher value means slower frame changing 
const OBSTACLE_SPAWN_RATE  = 2000;// enemy spawn rate in miliseconds
const NICOLAS_CAGE_SPAWN_RATE = 11000;// nicolas cage spawn rate in miliseconds
const SLIDE_HITBOX_THRESHOLD = 20;//threshold value for adding adding distance when sliding
//collision padding values for obstacle
const OBSTACLE_Y_PADDING = -20; // y value "padding"
const OBSTACLE_hEIGHT_PADDING = 50; //height "padding"
const OBSTACLE_X_PADDING = 10; //x value "padding"
const OBSTACLE_WIDTH_PADDING = 20; // width "padding"
//collision padding values for character - "padding" same as obstacle
const CHARACTER_Y_PADDING = -20;
const CHARACTER_HEIGHT_PADDING = 30;
const CHARACTER_X_PADDING = CHARACTER_WIDTH/3;
const CHARACTER_WIDTH_PADDING = CHARACTER_WIDTH*0.60;

const SCORE_X = 8; // x position for score rendering
const SCORE_Y = 20;// y position for score rendering
const TEXT_X = 300;// x position for general centerd text rendering
const TEXT_Y = CANVAS_HEIGHT/2; // y position for general centerd text rendering

const DUMB_AI_THRESHOLD  = 160; // minimum distance to take action
let DUMB_AI_ON = false; //decides if the the AI or the player control the update functions
const STOP_OBSTACLES_SPAWN_TIMEOUT = 5000; // nic Cage buff stops bird spawn for this amount
//debug mode
let DRAW_HITBOX = false; // if true will render the hit box

//declare game globals
let background;
let ground;
let character;
let obstacles = [];
let nicCages  = [];
let score = 0;
let bestScore = localStorage.getItem("bestScore")||0;
let paused = true;
let gameStarted = false;
let drawScore;
let drawTextAtCenter;
const canvas = document.getElementById('canvas');
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
const context = canvas.getContext('2d');

let IS_ALIVE = true;
let STOP_SPAWN = false;
let IMPOSSIBLE_MODE = false;

//chacks for a collision between 2 rectangles
let rectCollision = (rect1,rect2)=>{
    return (rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.height + rect1.y > rect2.y)
    }
    //returns true if a collision with an obstacle (Or Nic Cage...) has occurred 
    let  obstaclesCollisionDetection = (items)=>{
         //character
         let rect2 =character.getHitBox();
        return items.some((item)=>{
            let rect1 =item.getHitBox();
            return rectCollision(rect1,rect2);
                })
            }
            
let drawHitBox=()=>{
    //character
    let characterHitBox = character.getHitBox();
    context.strokeRect(characterHitBox.x,
        characterHitBox.y,
        characterHitBox.width,
        characterHitBox.height);
    //obstacle
    obstacles.forEach((obstacle)=>{
        let obstacleHitBox = obstacle.getHitBox();
        context.strokeRect(obstacleHitBox.x,
            obstacleHitBox.y,
            obstacleHitBox.width,
            obstacleHitBox.height);
    });
    //nic cage
    nicCages.forEach((nc)=>{
        let ncHitBox = nc.getHitBox();
        context.strokeRect(ncHitBox.x,
            ncHitBox.y,
            ncHitBox.width,
            ncHitBox.height);
    });
}

drawScore = ()=> {
    context.font = "16px Arial";
    context.fillStyle = "#0095DD";
    context.fillText("Score: "+score+ " Best Score:"+bestScore, SCORE_X, SCORE_Y);
  }

drawTextAtCenter = (text)=>{
    context.font = "24px Arial"; 
    context.fillStyle = "#FeFeFe";
    context.fillText(text,TEXT_X,TEXT_Y);
  }



function toggleShowHitBox(){
    DRAW_HITBOX = !DRAW_HITBOX;
}

function toggleImpossibleMode(){
    IMPOSSIBLE_MODE = !IMPOSSIBLE_MODE;
}

function toggleAI(){
    DUMB_AI_ON = !DUMB_AI_ON;
}
//based on euclidean distance decides to jump , slide or continue running
function dumbAI(character,obstacles){

    let characterCenterX = character.getX() + CHARACTER_WIDTH/2;
    let characterCenterY = character.getY() + CHARACTER_HEIGHT/2;
    if(character.getIsJumping())character.jump();//if the character is in the middle of the animation we wont let the ai disrupt it in the middle
    else if(obstacles.some((obstacle)=>{
        let obstacleCenterX = obstacle.getX() + OBSTACLE_WIDTH/2;
        let obstacleCenterY = obstacle.getY() + OBSTACLE_HEIGHT/2;
        return characterCenterY-obstacleCenterY<CHARACTER_JUMP_HEIGHT/8
        && Math.sqrt(Math.pow(characterCenterX-obstacleCenterX,2)+Math.pow(characterCenterY-obstacleCenterY,2)) < DUMB_AI_THRESHOLD
    })) character.jump();
    else if(obstacles.some((obstacle)=>{
        let obstacleCenterX = obstacle.getX() + OBSTACLE_WIDTH/2;
        let obstacleCenterY = obstacle.getY() - OBSTACLE_HEIGHT/2;
        return characterCenterY-obstacleCenterY>=CHARACTER_JUMP_HEIGHT/8
        && Math.sqrt(Math.pow(characterCenterX-obstacleCenterX,2)+Math.pow(characterCenterY-obstacleCenterY,2)) < DUMB_AI_THRESHOLD
    })) character.slide();
    else character.run();
}