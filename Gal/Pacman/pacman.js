//------------------------------------------------------------------------------
// Name: Gal shiff
//------------------------------------------------------------------------------

//------------------------------Global Variables--------------------------------

var pacman;
var enemyList = [];
var deadEnemyList = [];
var foodList = [];
var maze = [];
var obstaclesList = [];
var currentDirection = "";
var score = 0;
var lives = 3;
var gameover = false;
var gameStop = false;
var framesCounter = 0;;
var canEatEnemy = false;
var timeToEatEnemy = 0;
var enemyNumber;
var mazeType;
var lifeTime = 0;
var newLife = false;
var enemysSrc = [];

//------------------------------Consts---------------------------------------

const heartSrc = "images/heart.png";
const pacmanUp = "images/pacman-up.png";
const pacmanDown = "images/pacman-down.png";
const pacmanRight = "images/pacman-right.png";
const pacmanLeft = "images/pacman-left.png";
const enemyBonus = "images/bonus.png";
const REGULAR = "Regular";
const SIZE = 10;
const TIME = 300; 
const FRAMES = 20;
const LEFT = 37;
const UP = 38;
const RIGHT = 39;
const DOWN = 40;
const SPACE = 32;
const ENTER = 13;


//------------------------------Functions---------------------------------------

// This function get called when the html is load. It starts the game. 
function startGame() {
    pacman = new component(SIZE, SIZE, pacmanRight, 150, 100, "image", "pacman");
    enemyNumber = 4;
    mazeType = REGULAR;
    gameArea.start();
}


// This var represent the game area properties and the optional functions.
var gameArea = {
    canvas: document.createElement("canvas"),
    // start the game- set the interval
    start: function () {
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[2]);
        this.frameNo = 0;
        setDefaultsSetting();
        this.interval = setInterval(updateGameArea, FRAMES);
        addKeyListener();
    },
    // clear the game canvas area.
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    // stop the game- clear the interval
    stop: function () {
        clearInterval(this.interval);
    },
    // resume the game- set back the interval
    resume: function () {
        this.interval = setInterval(updateGameArea, FRAMES);
    },
    // restart the game- set from scratch the interval
    restart: function () {
        this.frameNo = 0;
        setDefaultsSetting();
        this.interval = setInterval(updateGameArea, FRAMES);
    },
}


// This function is used to handle the preesed keys on the keyboards.
function addKeyListener() {
    window.addEventListener('keydown', function (e) {
        pacman.key = e.keyCode;
    })

    window.addEventListener('keydown', function (e) {
        if (e.keyCode === SPACE) {
            if (!gameover) {
                if (gameStop) { // resume the game after space key is pressed.
                    document.getElementById("pause").style.display = "none";
                    document.getElementById("pannel").style.display = "block";
                    gameArea.resume();
                    gameStop = false;
                }
                else { // stop the game after space key is pressed.
                    gameArea.stop();
                    document.getElementById("pause").style.display = "block";
                    document.getElementById("pannel").style.display = "none";
                    gameStop = true;
                }
            }
        }
    })

    window.addEventListener('keydown', function (e) {
        if (e.keyCode === ENTER) { // start over the game after enter key is pressed.
            if (gameover) {
                gameover = false;
                document.getElementById("gameOver").style.display = "none";
                document.getElementById("pannel").style.display = "block";
                document.getElementById("finalScore").style.display = "none";
                restartLives(3);
                gameArea.clear();
                gameArea.restart();
            }
        }
    })
}


// This function sets the default setting of the game.
function setDefaultsSetting() {
    enemyList = [];
    deadEnemyList = [];
    foodList = [];
    maze = [];
    currentDirection = "";
    score = 0;
    lives = 3;
    gameover = false;
    gameStop = false;
    framesCounter = 0;
    canEatEnemy = false;
    timeToEatEnemy = 0;
    lifeTime = 0;
    newLife = false;
    obstaclesList = [];
    pacmanDefaultSettings();
    createEnemys(enemyNumber);
    createMaze(mazeType);
    createFood();
}


// This function check if the given comp is located between the given positions.
function inEnemySpace(left, right, down, up, comp) {
    if (comp.x >= left && comp.x <= right && comp.y >= down && comp.y <= up) {
        return true;
    }
    return false;
}


// This function checked if the comp position is divided by 10 or not.
function isTenDivison(comp) {
    if (comp.x % 10 === 0 && comp.y % 10 === 0) {
        return true;
    }
    return false;
}


// This function update the comp moves- where it can moves, 
// and where can't (to the index direction).
function canMove(index, comp) {
    for (var i = 0; i < comp.moves.length; i++) {
        if (index === i) {
            comp.moves[i] = false;
        }
        else {
            comp.moves[i] = true;
        }
    }
}


// This function represent the component.
function component(width, height, color, x, y, drawType, type) {
    this.startX = x;
    this.startY = y;
    this.moves = [false, true, false, true];
    this.drawType = drawType;
    this.type = type;
    this.color = color;
    if (drawType == "image") {
        this.image = new Image();
        this.image.src = color;
    }
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;

    // update the component style. 
    this.update = function () {
        ctx = gameArea.context;
        switch (this.drawType) {
            case ("image"):
                ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
                break;

            case ("circle"):
                ctx.beginPath();
                var radius = 1;
                if (this.color !== "white") {
                    radius = 3;
                }
                ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
                ctx.stroke();
                ctx.fillStyle = this.color;
                ctx.fill();
                break;

            case ("square"):
                ctx.fillStyle = this.color;
                ctx.fillRect(this.x, this.y, this.width, this.height);
                break;
        }
    }

    // update the component position.
    this.newPos = function () {
        this.x += this.speedX;
        this.y += this.speedY;
    }
}


// This function checked if the pacman eat food in the current move.
function eatFood() {
    for (var i = 0; i < foodList.length; i++) {
        // if the pacman 'eat' the life- user get life
        if (foodList[i].type === "heart" &&
            pacman.x === foodList[i].x && pacman.y === foodList[i].y) {
            restartLives(1);
            foodList.splice(i, 1);
            newLife = false;
            lifeTime = 0;
            return;
        }
        if (pacman.x + 5 === foodList[i].x && pacman.y + 5 === foodList[i].y) {
            // the pacman eat the bonus food. 
            if (foodList[i].color !== "white") {
                canEatEnemy = true;
                timeToEatEnemy = TIME;
            }
            foodList.splice(i, 1);
            score += 10;
            break;
        }
    }
}


// This function set the pacman to it's default setting.
function pacmanDefaultSettings() {
    pacman.x = pacman.startX;
    pacman.y = pacman.startY;
    pacman.key = "";
    currentDirection = "";
    pacman.speedX = 0;
    pacman.speedY = 0;
    pacman.image.src = pacmanRight;
}


// This function fill the canvas with 10 X 10 rects.
function fillCell() {
    var width = gameArea.canvas.width;
    var height = gameArea.canvas.height;
    ctx = gameArea.context;
    ctx.fillStyle = "black";
    for (var i = 0; i < width; i = i + 10) {
        for (var j = 0; j < height; j = j + 10) {
            ctx.fillRect(i, j, 10, 10);
            ctx.strokeRect(i, j, 10, 10);
        }
    }
}


//------------------------------------------------------------------------------


//------------------------------Game Options------------------------------------

// This function is used to start a new game.
function newGame() {
    enemyNumber = document.getElementById("enemyNumber").value;
    mazeType = document.getElementById("mazeType").value;
    restartLives(3);
    gameArea.clear();
    gameArea.stop();
    gameArea.restart();
}


// This function get called when the user won the game.
function winGame() {
    gameover = true;
    gameArea.stop();
    document.body.style.backgroundImage = "url('images/confetti1.gif')";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundRepeat = 'repeat-x';
    document.getElementById("winner").style.display = "block";
    document.getElementById("winner").style.margin = "1vw 0vh";
    document.getElementById("pannel").style.display = "none";
    document.getElementById("finalScoreWinner").innerHTML = "Your score is: " + score;
    document.getElementById("finalScoreWinner").style.display = "block";
}


// This function checked if the user win the game or not.
function checkWinGame() {
    if (foodList.length === 0) {
        //if (foodList.length < 300) {
        winGame();
    }
    // check for case the foodList contain only heart.
    for (var i = 0; i < foodList.length; i++) {
        if (foodList[i].type === "food") {
            return;
        }
    }
    winGame();
}


// This function check and handle the case of game over.
function gameOver() {
    if (lives === 0) {
        gameover = true;
        gameArea.stop();
        document.getElementById("gameOver").style.display = "block";
        document.getElementById("gameOver").style.margin = "1vw 0vh";
        document.getElementById("pannel").style.display = "none";
        document.getElementById("finalScore").innerHTML = "Your score is: " + score;
        document.getElementById("finalScore").style.display = "block";
    }
}


// This function move the enemys out off their zone. 
function moveOutEnemys() {
    if (framesCounter % 100 === 0) {
        for (var i = 0; i < enemyList.length; i++) {
            if (enemyList[i].x === enemyList[i].startX &&
                enemyList[i].y === enemyList[i].startY) {
                if (mazeType === REGULAR) {
                    while (inEnemySpace(100, 200, 50, 100, enemyList[i])) {
                        enemyList[i].y -= 1;
                    }
                    break;
                }
                else {
                    while (inEnemySpace(100, 200, 50, 100, enemyList[i])) {
                        enemyList[i].y -= 30;
                    }
                    break;
                }
            }
        }
    }
}


//------------------------------Collisions--------------------------------------


// This function handles the coliision of the given comp.
function handleCollision(direction, key, comp, index) {
    if (comp.type == "enemy") {
        handleCollisionEnemy(direction, key, comp, index)
    }
    else {
        handleCollisionPacman(direction, key, comp, index)
    }
}


// This function handles the coliision of the given enemy(comp).
function handleCollisionEnemy(direction, key, comp, index) {
    canMove(index, comp);
    var newX = 0;
    var newY = 0;
    var remainder = 0;

    // check if the enemy in x position that divide by 10. 
    if (comp.x % 10 !== 0) {
        remainder = comp.x % 10;
        newX = comp.x - remainder;
        if (comp.speedX < 0) {
            newX += 10;
        }
    }
    else {
        newX = comp.x;
    }

    // check if the enemy in y position that divide by 10.
    if (comp.y % 10 !== 0) {
        remainder = comp.y % 10;
        newY = comp.y - remainder;
        if (comp.speedY < 0) {
            newY += 10;
        }
    }
    else {
        newY = comp.y;
    }

    comp.x = newX;
    comp.y = newY;
    clearmove(comp);
}


// This function handles the coliision of the given pacman(comp).
function handleCollisionPacman(direction, key, comp, index) {
    if (direction !== key) { // if the pacman current direction is different from the preesed key
        if (checkCollision(direction, direction, comp)) {
            clearmove(comp);
        }
        else {
            moveThrow(comp);
        }
    }
    else {
        if (!moveThrow(comp)) { // check if the comp can move throw this collision.
            clearmove(comp);
        }
    }
    canMove(index, comp);
}


// This function checks if the comp can move throw the obstacle.
function moveThrow(comp) {
    var width = gameArea.canvas.width;
    var height = gameArea.canvas.height;
    // left
    if (comp.x <= 10 && comp.y >= 50 && comp.y < height / 2 + 20) {
        eatFood();
        comp.x = 280;
        return true;
    }
    // up
    if (comp.y <= 10 && comp.x >= 80 && comp.x < width / 2 + 60) {
        eatFood();
        comp.y = 130;
        return true;
    }
    // right
    if (comp.x >= width - 20 && comp.y >= 50 && comp.y < height / 2 + 20) {
        eatFood();
        comp.x = 10;
        return true;
    }
    //down
    if (comp.y >= height - 20 && comp.x >= 80 && comp.x < width / 2 + 60) {
        eatFood();
        comp.y = 10;
        return true;
    }
    return false;
}


// This function checks for a coliision of the given comp with all the obstacles.
function checkCollision(key, direction, comp) {
    var width = gameArea.canvas.width;
    var height = gameArea.canvas.height;
    var index;

    switch (key) {

        case (RIGHT):
            index = RIGHT - 37;
            if (comp.x >= width - 20 || (inEnemySpace(100, 185, 45, 95, comp) && mazeType === REGULAR)
                || checkCollisionMazeY(comp.x + 10, comp.y, comp)) {
                handleCollision(direction, key, comp, index);
                return true;
            }
            else {
                comp.moves[index] = true;
            }
            return false;

        case (LEFT):

            index = LEFT - 37;
            if (comp.x <= 10 || (inEnemySpace(115, 190, 45, 95, comp) && mazeType === REGULAR)
                || checkCollisionMazeY(comp.x, comp.y, comp)) {
                handleCollision(direction, key, comp, index);
                return true;
            }
            else {
                comp.moves[index] = true;
            }
            return false;

        case (UP):

            index = UP - 37;
            if (comp.y <= 10 || (inEnemySpace(105, 185, 45, 100, comp) && mazeType === REGULAR)
                || checkCollisionMazeX(comp.x, comp.y, comp)) {
                handleCollision(direction, key, comp, index);
                return true;
            }
            else {
                comp.moves[index] = true;
            }
            return false;

        case (DOWN):

            index = DOWN - 37;
            if (comp.y >= height - 20 || (inEnemySpace(105, 185, 40, 95, comp) && mazeType === REGULAR)
                || checkCollisionMazeX(comp.x, comp.y + 10, comp)) {
                handleCollision(direction, key, comp, index);
                return true;
            }
            else {
                comp.moves[index] = true;
            }
            return false;
    }
    return false;
}


// This function checks if the pacman is collide with the enemys.
function enemyCollision() {
    for (var i = 0; i < enemyList.length; i++) {
        if (pacman.x <= enemyList[i].x && pacman.x + 10 >= enemyList[i].x &&
            pacman.y <= enemyList[i].y && pacman.y + 10 >= enemyList[i].y) {
            if (canEatEnemy && timeToEatEnemy > 0) { // pacman can eat the enemys.
                clearmove(enemyList[i]);
                deadEnemyList.push(enemyList.splice(i, 1));
                score += 100;
            }
            else {
                pacmanDefaultSettings();
                enemyList = []
                createEnemys(enemyNumber);
                var imgs = document.getElementsByClassName("live");
                for (var j = 0; j < imgs.length; j++) {
                    if (imgs[j].src.includes("images/pacman.png")) {
                        imgs[j].src = "images/pacman-grey.png";
                        lives--;
                        break;
                    }
                }
            }
            break;
        }
    }
}


//------------------------------Creating Elements--------------------------------


// This function create obsacles according to the input.
function createObstacle(width, height, color, x, y, flag) {
    var obstacle = new component(width, height, color, x, y, "square", "obstacle");
    if (flag) {
        maze.push(obstacle);
    }
    else {
        obstaclesList.push(obstacle);
    }
}


// This function create a square of obstacle.
function createObstacleSquare(width1, height1, width2, height2, color, x1, y1, x2, y2, flag) {
    // UP
    createObstacle(width1, height1, color, x1, y1, flag);
    // DOWN
    createObstacle(width1, height1, color, x1, y2, flag);
    // LEFT
    createObstacle(width2, height2, color, x1, y1, flag);
    // RIGHT 
    createObstacle(width2, height2, color, x2, y1, flag);
}


// This function create the game borders.
function createBorders(flag) {
    var width = gameArea.canvas.width;
    var height = gameArea.canvas.height;

    // blue-border (border)
    createObstacleSquare(width - 10, 1, 1, height - 10, "blue", 5, 5, width - 5, height - 5, flag);

    // green-border (teleport)
    createObstacle(width / 2 - 20, 1, "green", 80, 5, flag); // up
    createObstacle(width / 2 - 20, 1, "green", 80, height - 5, flag); // down
    createObstacle(1, height / 2 - 20, "green", 5, 50, flag); // left
    createObstacle(1, height / 2 - 20, "green", width - 5, 50, flag); //right
}


// This function creates the enemy space.
function createEnemySpace(flag) {
    createObstacleSquare(70, 1, 1, 40, "blue", 115, 55, 185, 95, flag);
}


// This function create the whole maze.
function createMaze(mazeType) {
    createBorders(true);  // borders
    if (mazeType === "myMaze") { // create Gal difficulty
        createMyMaze(false);
    }
    else {
        createEnemySpace(true); // Enemy space
    }
}


// This function creates 'My Maze' option.
function createMyMaze(flag) {

    // G
    createObstacle(60, 1, "blue", 40, 50, flag);
    createObstacle(60, 1, "blue", 40, 110, flag);
    createObstacle(1, 60, "blue", 40, 50, flag);
    createObstacle(1, 30, "blue", 100, 80, flag);
    createObstacle(40, 1, "blue", 60, 80, flag);

    //A 
    createObstacleSquare(60, 1, 1, 40, "blue", 120, 50, 180, 90, flag);
    createObstacle(1, 20, "blue", 120, 90, flag);
    createObstacle(1, 20, "blue", 180, 90, flag);

    //L 
    createObstacle(60, 1, "blue", 200, 110, flag);
    createObstacle(1, 60, "blue", 200, 50, flag);
}


// This function creates the enemys.
function createEnemys(enemyNumber) {
    var src;
    var enemy;
    var colors = ["red", "green", "pink", "yellow"];
    var enemyPosX = [130, 130, 160, 160];
    var enemyPosY = [60, 80, 60, 80];
    for (var i = 0; i < enemyNumber; i++) {
        src = "images/ghost-" + colors[i] + ".gif"
        enemy = new component(10, 10, src, enemyPosX[i], enemyPosY[i], "image", "enemy");
        enemy.moves = [true, true, true, true];
        enemyList.push(enemy);
        enemysSrc.push(src);
    }
}


// This function creates the enemys. 
function createFood() {
    var width = gameArea.canvas.width;
    var height = gameArea.canvas.height;
    var color;
    var exist = false;
    for (var i = 15; i < width - 10; i = i + 10) {
        for (var j = 15; j < height - 10; j = j + 10) {
            exist = false;
            color = "white";
            // Bonus food:
            if ((i === 15 && j === 15) ||   // UPPER LEFT
                (i === 15 && j === 135) ||  // UPPER RIGHT
                (i === 285 && j === 15) ||  // DOWN LEFT
                (i === 285 && j === 135)) { // DOWN RIGHT
                color = "red";
            }
            // Enemy space:
            if (mazeType === REGULAR) {
                if (i > 105 && i < 195 && j > 45 && j < 105) {
                    continue;
                }
            }
            else {
                if (i > 120 && i < 180 && j > 50 && j < 90) {
                    continue;
                }
            }
            // The pacman location:
            if (i === pacman.x + 5 && j === pacman.y + 5) {
                continue;
            }
            // check if there are obstacles in the current spot for the food:
            for (var k = 0; k < maze.length; k++) {
                if (i >= maze[k].x && i <= maze[k].x + maze[k].width) {
                    if (j >= maze[k].y && j <= maze[k].y + maze[k].height) {
                        exist = true;
                        break;
                    }
                }
            }
            if (!exist) {
                var food = new component(50, 50, color, i, j, "circle", "food");
                foodList.push(food);
            }
        }
    }
}


//------------------------------Lives--------------------------------


// This function try to find an empty area to give the user option to get a new life.
function getNewLife() {
    var lifeX = Math.floor((Math.random() * 20) + 1) * 10;
    var lifeY = Math.floor((Math.random() * 10) + 1) * 10;
    var empty = true;
    for (var i = 0; i < foodList.length; i++) {
        if (foodList[i].x === lifeX + 5 && foodList[i].y === lifeY + 5) {
            empty = false;
            break;
        }
    }
    if (empty) {
        var life = new component(10, 10, heartSrc, lifeX, lifeY, "image", "heart");
        if (!inEnemySpace(100, 200, 50, 100, life)) {
            foodList.push(life);
            return true;
        }
    }
    return false;
}


// This function called to remove the life icon from the game board. 
function removeNewLife() {
    for (var i = 0; i < foodList.length; i++) {
        if (foodList[i].type === "heart") {
            foodList.splice(i, 1);
        }
    }
}


// This function is used to update the user lives by the given length.
function restartLives(length) {
    var imgs = document.getElementsByClassName("live");
    for (var i = imgs.length - 1; i >= 0; i--) {
        if (imgs[i].src.includes("images/pacman-grey.png")) {
            imgs[i].src = "images/pacman.png";
            length--;
            lives++;
        }
        if (length === 0) {
            break;
        }
    }
}


//------------------------------Movement--------------------------------


// This function update the movement of the given comp by it's key.
function updateMovement(comp) {
    if (comp.key === LEFT && comp.moves[0] && isTenDivison(comp)) {
        comp.speedY = 0;
        if (moveleft(comp)) {
            comp.moves[RIGHT - 37] = true; // right
            if (comp.type == "pacman") {
                currentDirection = LEFT// "left";
            }
        }

    }
    if (comp.key === UP && comp.moves[1] && isTenDivison(comp)) {
        comp.speedX = 0;
        if (moveup(comp)) {
            comp.moves[DOWN - 37] = true; // down
            if (comp.type == "pacman") {
                currentDirection = UP //"up";
            }
        }
    }
    if (comp.key === RIGHT && comp.moves[2] && isTenDivison(comp)) {
        comp.speedY = 0;
        if (moveright(comp)) {
            comp.moves[LEFT - 37] = true; // left
            if (comp.type == "pacman") {
                currentDirection = RIGHT //"right";
            }
        }
    }
    if (comp.key === DOWN && comp.moves[3] && isTenDivison(comp)) {
        comp.speedX = 0;
        if (movedown(comp)) {
            comp.moves[UP - 37] = true; //up
            if (comp.type == "pacman") {
                currentDirection = DOWN //"down";
            }
        }
    }
}


// This function checks for a collision of the given comp with obstacles- on the X axis.
function checkCollisionMazeX(posX, posY, comp) {
    for (var i = 0; i < obstaclesList.length; i++) {
        if (posX >= obstaclesList[i].x && posX <= obstaclesList[i].x + obstaclesList[i].width - 5 &&
            posY === obstaclesList[i].y && isTenDivison(comp)) {
            return true;
        }
    }
    return false;
}


// This function checks for a collision of the given comp with obstacles- on the Y axis.
function checkCollisionMazeY(posX, posY, comp) {
    for (var i = 0; i < obstaclesList.length; i++) {
        if (posY >= obstaclesList[i].y && posY <= obstaclesList[i].y + obstaclesList[i].height - 5 &&
            posX === obstaclesList[i].x && isTenDivison(comp)) {
            //clearmove(comp);
            return true;
        }
    }
    return false;
}


// This function try to move up the comp.
function moveup(comp) {
    if (!checkCollision(comp.key, currentDirection, comp)) {
        if (comp.type === "pacman") {
            comp.image.src = pacmanUp;
        }
        comp.speedY = -1;
        return true;
    }
    return false;
}


// This function try to move down the comp.
function movedown(comp) {
    if (!checkCollision(comp.key, currentDirection, comp)) {
        if (comp.type === "pacman") {
            comp.image.src = pacmanDown;
        }
        comp.speedY = 1;
        return true;
    }
    return false;
}


// This function try to move left the comp.
function moveleft(comp) {
    if (!checkCollision(comp.key, currentDirection, comp)) {
        if (comp.type === "pacman") {
            comp.image.src = pacmanLeft;
        }
        comp.speedX = -1;
        return true;
    }
    return false;
}


// This function try to move right the comp.
function moveright(comp) {
    if (!checkCollision(comp.key, currentDirection, comp)) {
        if (comp.type === "pacman") {
            comp.image.src = pacmanRight;
        }
        comp.speedX = 1;
        return true;
    }
    return false;
}


// This function set the comp's speedX and speedY to 0.
function clearmove(comp) {
    comp.speedX = 0;
    comp.speedY = 0;
}


// This function move the enemy randomally.
function moveEnemy(enemy) {
    var option = Math.floor(Math.random() * 4);
    while (enemy.moves[option] !== true) {
        option = Math.floor(Math.random() * 4);
    }
    enemy.key = option + 37; // choose random dir- 37 = left, 39 = right 38 - up, 40 - down
    updateMovement(enemy);
}


//------------------------------Updates--------------------------------


// This function updtae the score on the board.
function updsateScore() {
    document.getElementById("score").innerHTML = "Score:  " + score;
}


// This function checks if the pacman can still eat the enemys.
function updateEatEnemy() {
    if (timeToEatEnemy <= 0) {
        canEatEnemy = false;
    }
    if (canEatEnemy) {
        timeToEatEnemy--;
    }
}

// This function is used to give bonus life.
function updateNewLife() {
    if (framesCounter % 50 === 0 && !newLife && lives < 3) {
        if (getNewLife()) {
            lifeTime = TIME;
            newLife = true;
        }
    }
    if (lifeTime <= 0) {
        newLife = false;
        removeNewLife();
    }
    if (newLife) {
        lifeTime--;
    }
}


// This function update the color of the bonus food.
function updateFoodBonus() {
    if (framesCounter % 5 === 0) {
        for (var i = 0; i < foodList.length; i++) {
            if (foodList[i].color === "red") {
                foodList[i].color = "orange";
            }
            else {
                if (foodList[i].color === "orange") {
                    foodList[i].color = "red";
                }
            }
        }
    }
}


// This function update everything in the game.
function updateGameArea() {
    moveOutEnemys();
    updateEatEnemy();
    framesCounter++;
    gameArea.clear();
    fillCell();
    eatFood();
    updsateScore();
    updateNewLife();
    enemyCollision();
    updateMovement(pacman);
    pacman.newPos();
    pacman.update();
    updateFoodBonus();
    checkCollision(pacman.key, currentDirection, pacman);
    updateDeadEnemys();
    updateComponents();
    checkWinGame();
    gameOver();
}


// This function update the dead enemys list.
function updateDeadEnemys() {
    for (var i = 0; i < deadEnemyList.length; i++) {
        var enemy = deadEnemyList[i][0];
        enemy.x = enemy.startX;
        enemy.y = enemy.startY;
        enemyList.push(enemy); // return the enemy to the game.
        deadEnemyList.splice(i, 1);
        break;
    }
}


// This function update the components- enemys, food and the maze.
function updateComponents() {
    // update enemys:
    updateEnemys();
    // update food:
    for (var i = 0; i < foodList.length; i++) {
        foodList[i].update();
    }
    // update the maze:
    for (var i = 0; i < maze.length; i++) {
        maze[i].update();
    }
    // update the obstacles:
    for (var i = 0; i < obstaclesList.length; i++) {
        obstaclesList[i].update();
    }
}


// This function update the enemys.
function updateEnemys() {
    for (var i = 0; i < enemyList.length; i++) {
        var enemy = enemyList[i];
        if (framesCounter % 5 === 0) {
            if (mazeType !== REGULAR) {
                // check the enemys not inside their zone.
                if (enemy.x !== enemy.startX ||
                    enemy.y !== enemy.startY) {
                    moveEnemy(enemy);
                }
            }
            else {
                moveEnemy(enemy);
            }
        }
        enemy.newPos();
        if (canEatEnemy) { // change the enemy image to 'bonus' enemy.
            enemy.image.src = enemyBonus;
            if (timeToEatEnemy < 80) {
                if (framesCounter % 10 < 5) { // sparkle enemy
                    enemy.update();
                }
            }
            else {
                enemy.update();
            }
        }
        else {
            enemy.image.src = enemysSrc[i];
            enemy.update();
        }
        checkCollision(enemy.key, enemy.key, enemy);
    }
}

//------------------------------------------------------------------------------
