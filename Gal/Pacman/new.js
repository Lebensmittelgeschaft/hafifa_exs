

var pacman;
var enemyList = [];
var foodList = [];
var maze = [];
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
var heartSrc = "images/heart.png";
var pacmanUp = "images/pacman-up.png";
var pacmanDown = "images/pacman-down.png";
var pacmanRight = "images/pacman-right.png";
var pacmanLeft = "images/pacman-left.png";
var enemyBonus = "images/bonus.png";
var enemysSrc = [];
var LEFT = 37;
var UP = 38;
var RIGHT = 39;
var DOWN = 40;


function startGame() {
    pacman = new component(10, 10, pacmanRight, 30, 30, "image", "pacman");
    //pacman = new component(10, 10, "yellow", 30, 30, "square", "pacman");
    enemyNumber = 4;
    mazeType = "Regular"
    gameArea.start();
}

var gameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[2]);
        this.frameNo = 0;
        setDefaultsSetting();
        this.interval = setInterval(updateGameArea, 20);
        addKeyListener();
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop: function () {
        clearInterval(this.interval);
    },
    resume: function () {
        this.interval = setInterval(updateGameArea, 20);
    },
    restart: function () {
        this.frameNo = 0;
        setDefaultsSetting();
        this.interval = setInterval(updateGameArea, 20);
    },
}

function addKeyListener() {
    window.addEventListener('keydown', function (e) {
        pacman.key = e.keyCode;
    })
    window.addEventListener('keydown', function (e) {
        if (e.keyCode === 32) {
            if (!gameover) {
                if (gameStop) {
                    document.getElementById("pause").style.display = "none";
                    document.getElementById("pannel").style.display = "block";
                    gameArea.resume();
                    gameStop = false;
                }
                else {
                    gameArea.stop();
                    document.getElementById("pause").style.display = "block";
                    document.getElementById("pannel").style.display = "none";
                    gameStop = true;
                }
            }
        }
    })
}

function setDefaultsSetting() {
    enemyList = [];
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
    framesCounter = 0;
    lifeTime = 0;
    newLife = false;
    pacmanDefaultSettings();
    createEnemys(enemyNumber);
    createFood();
    createMaze(mazeType);
}

function getNewLife() {
    var lifeX = Math.floor((Math.random() * 20) + 1) * 10;
    var lifeY = Math.floor((Math.random() * 10) + 1) * 10;
    console.log(lifeX);
    console.log(lifeY);
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

function removeNewLife() {
    for (var i = 0; i < foodList.length; i++) {
        if (foodList[i].type === "heart") {
            foodList.splice(i, 1);
        }
    }
}

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

function newGame() {
    enemyNumber = document.getElementById("enemyNumber").value;
    mazeType = document.getElementById("mazeType").value;
    restartLives(3);
    gameArea.clear();
    gameArea.stop();
    gameArea.restart();
}

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

function inEnemySpace(left, right, down, up, comp) {
    // Enemy Space
    if (comp.x >= left && comp.x <= right && comp.y >= down && comp.y <= up) {
        return true;
    }
    return false;
}

function handleCollision(direction, key, comp, index) {
    if (comp.type == "enemy") {
        canMove(index, comp);
        var newX = 0;
        var newY = 0;
        var remainder = 0;

        console.log("before" + newX, newY);
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
        console.log(newX, newY);
        //changeDirectionEnemy(comp);
        comp.x = newX;
        comp.y = newY;
        clearmove(comp);
    }
    else {
        if (direction !== key) {
            if (checkCollision(direction, direction, comp)) {
                clearmove(comp);
            }
            else {
                moveThrow(comp);
            }
        }
        else {
            if (!moveThrow(comp)) {
                clearmove(comp);
            }
        }
        canMove(index, comp);
    }
    /*if (comp.type === "enemy") {
        changeDirectionEnemy(comp);
        console.log("key after:" + comp.key);
        console.log("moves after:" + comp.moves);
    }*/
}

function moveThrow(comp) {
    var width = gameArea.canvas.width;
    var height = gameArea.canvas.height;
    //console.log("y: " + comp.y);
    //console.log("x: " + comp.x);
    //console.log("green: " + width / 2);
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

function changeDirection(comp) {
    for (var i = 0; i < comp.moves.length; i++) {
        if (comp.moves[i]) {
            var dir = i + 37;
            var xSpeed = 0;
            var ySpeed = 0;
            switch (i) {
                case (0):
                    xSpeed = -1;
                    break;
                case (1):
                    xSpeed = 1;
                    break;
                case (2):
                    ySpeed = -1;
                    break;
                case (3):
                    ySpeed = 1;
                    break;
            }
            //console.log("key 0:" + enemy.key);
            //console.log("moves 0:" + enemy.moves);
            comp.speedX = xSpeed;
            comp.speedY = ySpeed;
            //updateEnemyMovement(enemy, false);
            //console.log("key 1:" + enemy.key);
            //console.log("moves 1:" + enemy.moves)
            break;
        }
    }
    canMove(-1, comp);
}

function checkCollision(key, direction, comp) {
    /*if (checkCollisionDown() || checkCollisionLeft() ||
        checkCollisionRight() || checkCollisionUp()) {
        clearmove();
    }*/
    var width = gameArea.canvas.width;
    var height = gameArea.canvas.height;
    var index;

    switch (key) {
        case (RIGHT):
            index = RIGHT - 37;
            if (comp.x >= width - 20 || inEnemySpace(100, 185, 45, 95, comp)) {
                handleCollision(direction, key, comp, index);
                return true;
            }
            else {
                comp.moves[index] = true;
            }
            return false;

        case (LEFT):
            index = LEFT - 37;
            if (comp.x <= 10 || inEnemySpace(115, 190, 45, 95, comp)) {
                handleCollision(direction, key, comp, index);
                return true;
            }
            else {
                comp.moves[index] = true;
            }
            return false;

        case (UP):
            index = UP - 37;
            if (comp.y <= 10 || inEnemySpace(105, 185, 45, 100, comp)) {
                handleCollision(direction, key, comp, index);
                return true;
            }
            else {
                comp.moves[index] = true;
            }
            return false;

        case (DOWN):
            index = DOWN - 37;
            if (comp.y >= height - 20 || inEnemySpace(105, 185, 40, 95, comp)) {
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

function isTenDivison(comp) {
    if (comp.x % 10 === 0 && comp.y % 10 === 0) {
        return true;
    }
    return false;
}

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

function component(width, height, color, x, y, drawType, type) {
    this.StartX = x;
    this.StartY = y;
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
    this.update = function () {
        ctx = gameArea.context;
        switch (this.drawType) {
            case ("image"):
                //this.image.src = color;
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
                //ctx.fill (this.x, this.y, this.width, this.height);
                break;
            case ("square"):
                ctx.fillStyle = this.color;
                ctx.fillRect(this.x, this.y, this.width, this.height);
                break;

        }
    }
    this.newPos = function () {
        this.x += this.speedX;
        this.y += this.speedY;
    }
}

function eatFood() {
    for (var i = 0; i < foodList.length; i++) {
        // get life
        if (foodList[i].type === "heart" &&
            pacman.x === foodList[i].x && pacman.y === foodList[i].y) {
            restartLives(1);
            removeNewLife();
            newLife = false;
            lifeTime = 0;
            return;
        }
        if (pacman.x + 5 === foodList[i].x && pacman.y + 5 === foodList[i].y) {
            // bonus 
            if (foodList[i].color !== "white") {
                canEatEnemy = true;
                timeToEatEnemy = 200;
            }
            foodList.splice(i, 1);
            score += 10;
            break;
        }
    }
}

function pacmanDefaultSettings() {
    pacman.x = pacman.StartX;
    pacman.y = pacman.StartY;
    pacman.key = "";
    currentDirection = "";
    pacman.speedX = 0;
    pacman.speedY = 0;
    pacman.image.src = pacmanRight;
}


function enemyCollision() {
    for (var i = 0; i < enemyList.length; i++) {
        if (pacman.x <= enemyList[i].x && pacman.x + 10 >= enemyList[i].x &&
            pacman.y <= enemyList[i].y && pacman.y + 10 >= enemyList[i].y) {
            if (canEatEnemy && timeToEatEnemy > 0) {
                enemyList.splice(i, 1);
                score += 100;
            }
            else {
                pacmanDefaultSettings();
                enemyList = []
                createEnemys(enemyNumber);
                var imgs = document.getElementsByClassName("live");
                //console.log(imgs.src.includes("images/pacman.png"));
                for (var j = 0; j < imgs.length; j++) {
                    if (imgs[j].src.includes("images/pacman.png")) {
                        console.log("yes");
                        imgs[j].src = "images/pacman-grey.png";
                        lives--;
                        console.log(imgs[j], imgs[j].attributes.src);
                        break;
                    }
                }
            }
            break;
        }
    }
}

function updsateScore() {
    document.getElementById("score").innerHTML = "Score:  " + score;
}

function updateEatEnemy() {
    if (timeToEatEnemy <= 0) {
        canEatEnemy = false;
    }
    if (canEatEnemy) {
        timeToEatEnemy--;
    }
}


function updateNewLife() {
    if (framesCounter % 10 === 0 && !newLife && lives < 3) {
        if (getNewLife()) {
            lifeTime = 300;
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

function updateFoodBonus() {
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

function checkWinGame() {
    if (foodList.length === 0) {
        //if (foodList.length < 300) {
        winGame();
    }
    for (var i = 0; i < foodList.length; i++) {
        if (foodList[i].type === "food") {
            return;
        }
    }
    winGame();
}

function updateGameArea() {
    updateEatEnemy();
    framesCounter += 1;
    gameArea.clear();
    fillCell();
    eatFood();
    updsateScore();
    updateNewLife();
    enemyCollision();
    updateMovement(pacman);
    pacman.newPos();
    pacman.update();
    if (framesCounter % 5 === 0) {
        updateFoodBonus();
    }
    checkCollision(pacman.key, currentDirection, pacman);
    for (var i = 0; i < enemyList.length; i++) {
        var enemy = enemyList[i];
        if (framesCounter % 5 === 0) {
            moveEnemy(enemy);
        }
        enemy.newPos();
        if (canEatEnemy) {
            enemy.image.src = enemyBonus;
        }
        else {
            enemy.image.src = enemysSrc[i];
        }
        enemy.update();
        checkCollision(enemy.key, enemy.key, enemy);
    }
    for (var i = 0; i < foodList.length; i++) {
        foodList[i].update();
    }
    for (var i = 0; i < maze.length; i++) {
        maze[i].update();
    }
    checkWinGame();
    gameOver();
}

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

function clearmove(comp) {
    comp.speedX = 0;
    comp.speedY = 0;
}

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

function createMaze(mazeType) {
    var width = gameArea.canvas.width;
    var height = gameArea.canvas.height;
    for (var i = 0; i < width; i = i + 10) {
        for (var j = 0; j < height; j = j + 10) {
            switch (i) {
                case (0):
                    var obstacle = new component(width - 10, 1, "blue", 5, 5, "square", "obstacle");
                    maze.push(obstacle);
                    var obstacle = new component(width / 2 - 20, 1, "green", 80, 5, "square", "obstacle");
                    maze.push(obstacle);
                case (width - 1):
                    var obstacle = new component(width - 10, 1, "blue", 5, height - 5, "square", "obstacle");
                    maze.push(obstacle);
                    var obstacle = new component(width / 2 - 20, 1, "green", 80, height - 5, "square", "obstacle");
                    maze.push(obstacle);
            }
            switch (j) {
                case (0):
                    var obstacle = new component(1, height - 10, "blue", 5, 5, "square", "obstacle");
                    maze.push(obstacle);
                    var obstacle = new component(1, height / 2 - 20, "green", 5, 50, "square", "obstacle");
                    maze.push(obstacle);
                case (height - 1):
                    var obstacle = new component(1, height - 10, "blue", width - 5, 5, "square", "obstacle");
                    maze.push(obstacle);
                    var obstacle = new component(1, height / 2 - 20, "green", width - 5, 50, "square", "obstacle");
                    maze.push(obstacle);
            }
        }
    }
    // Enemy space- up
    for (var i = 0; i < 7; i++) {
        var obstacle = new component(10, 1, "blue", 115 + 10 * i, 55, "square", "obstacle");
        maze.push(obstacle);
    }
    // Enemy space- down
    for (var i = 0; i < 7; i++) {
        var obstacle = new component(10, 1, "blue", 115 + 10 * i, 95, "square", "obstacle");
        maze.push(obstacle);
    }

    // Enemy space- left
    for (var i = 0; i < 4; i++) {
        var obstacle = new component(1, 10, "blue", 115, 55 + 10 * i, "square", "obstacle");
        maze.push(obstacle);
    }
    // Enemy space- right
    for (var i = 0; i < 4; i++) {
        var obstacle = new component(1, 10, "blue", 185, 55 + 10 * i, "square", "obstacle");
        maze.push(obstacle);
    }

    // create Gal difficulty
    //Up
    if (mazeType === "myMaze") {
        createMyMaze();
    }
}

function createMyMaze() {
    // G
    for (var i = 0; i < 7; i++) {
        var obstacle = new component(10, 1, "blue", 25 + 10 * i, 55, "square", "obstacle");
        maze.push(obstacle);
    }
    //  down
    for (var i = 0; i < 7; i++) {
        var obstacle = new component(10, 1, "blue", 25 + 10 * i, 115, "square", "obstacle");
        maze.push(obstacle);
    }

    // left
    for (var i = 0; i < 6; i++) {
        var obstacle = new component(1, 10, "blue", 25, 55 + 10 * i, "square", "obstacle");
        maze.push(obstacle);
    }
    //right
    for (var i = 0; i < 3; i++) {
        var obstacle = new component(1, 10, "blue", 95, 85 + 10 * i, "square", "obstacle");
        maze.push(obstacle);
    }
    for (var i = 0; i < 5; i++) {
        var obstacle = new component(10, 1, "blue", 45 + 10 * i, 85, "square", "obstacle");
        maze.push(obstacle);
    }


    //A 
    // Enemy space- left
    for (var i = 0; i < 6; i++) {
        var obstacle = new component(1, 10, "blue", 115, 55 + 10 * i, "square", "obstacle");
        maze.push(obstacle);
    }
    // Enemy space- right
    for (var i = 0; i < 6; i++) {
        var obstacle = new component(1, 10, "blue", 185, 55 + 10 * i, "square", "obstacle");
        maze.push(obstacle);
    }

    //L 
    //  down
    for (var i = 0; i < 7; i++) {
        var obstacle = new component(10, 1, "blue", 205 + 10 * i, 115, "square", "obstacle");
        maze.push(obstacle);
    }

    // left
    for (var i = 0; i < 6; i++) {
        var obstacle = new component(1, 10, "blue", 205, 55 + 10 * i, "square", "obstacle");
        maze.push(obstacle);
    }
}



function createEnemys(enemyNumber) {
    var src;
    var enemy;
    var colors = ["red", "green", "pink", "yellow"];
    var enemyPosX = [130, 130, 160, 160];
    var enemyPosY = [60, 80, 60, 80];
    for (var i = 0; i < enemyNumber; i++) {
        src = "images/ghost-" + colors[i] + ".gif"
        //enemy = new component(10, 10, src, enemyPosX[i], enemyPosY[i], "image", "enemy");
        enemy = new component(10, 10, src, 60 + 10 * i, 100 + 10 * i, "image", "enemy");
        enemy.moves = [true, true, true, true];
        enemyList.push(enemy);
        enemysSrc.push(src);
    }

    //var enemy = new component(10, 10, "images/ghost-" + colors[0] + ".gif", 130, 60, "image");
    /*var enemy = new component(10, 10, "images/ghost-" + colors[0] + ".gif", 60, 60, "image", "enemy");
    enemyList.push(enemy);
    //var enemy = new component(10, 10, "images/ghost-" + colors[1] + ".gif", 130, 80, "image");
    var enemy = new component(10, 10, "images/ghost-" + colors[1] + ".gif", 80, 80, "image", "enemy");
    enemyList.push(enemy);
    //var enemy = new component(10, 10, "images/ghost-" + colors[2] + ".gif", 160, 60, "image");
    var enemy = new component(10, 10, "images/ghost-" + colors[2] + ".gif", 100, 100, "image", "enemy");
    enemyList.push(enemy);
    //var enemy = new component(10, 10, "images/ghost-" + colors[3] + ".gif", 160, 80, "image");
    var enemy = new component(10, 10, "images/ghost-" + colors[3] + ".gif", 120, 10, "image", "enemy");
    enemyList.push(enemy);

    for (var i = 0; i < colors.length; i++) {
        enemysSrc.push("images/ghost-" + colors[i] + ".gif");
    }*/

}

function createFood() {
    var width = gameArea.canvas.width;
    var height = gameArea.canvas.height;
    var color;
    for (var i = 15; i < width - 10; i = i + 10) {
        for (var j = 15; j < height - 10; j = j + 10) {
            color = "white";
            if ((i === 15 && j === 15) || (i === 15 && j === 135) ||
                (i === 285 && j === 15) || (i === 285 && j === 135)) {
                color = "red";
            }
            if (i > 105 && i < 195 && j > 45 && j < 105) {
                continue;
            }
            if (i === pacman.x + 5 && j === pacman.y + 5) {
                continue;
            }
            //for (var k = 0; k <)
            var food = new component(50, 50, color, i, j, "circle", "food");
            foodList.push(food);
        }
    }
}


function moveEnemy(enemy) {
    var option = Math.floor(Math.random() * 4);
    while (enemy.moves[option] !== true) {
        option = Math.floor(Math.random() * 4);
    }
    enemy.key = option + 37; // choose random dir- 37 = left, 39 = right 38 - up, 40 - down
    updateMovement(enemy);
}

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

//---------------------- copy of move funcs to enemy ----------------------

/*function moveEnemyup(enemy, check) {
    if (check) {
        if (!checkCollision(enemy.key, enemy.key, enemy)) {
            enemy.speedY = -1;
            return true;
        }
        return false;
    }
    else {
        enemy.speedY = -1;
        return true;
    }

}

function moveEnemydown(enemy, check) {
    if (check) {
        if (!checkCollision(enemy.key, enemy.key, enemy)) {
            enemy.speedY = 1;
            return true;
        }
        return false;
    } else {
        enemy.speedY = 1;
        return true;
    }
}

function moveEnemyleft(enemy, check) {
    if (check) {
        if (!checkCollision(enemy.key, enemy.key, enemy)) {
            enemy.speedX = -1;
            return true;
        }
        return false;
    }
    else {
        enemy.speedX = -1;
        return true;
    }
}

function moveEnemyright(enemy, check) {
    if (check) {
        if (!checkCollision(enemy.key, enemy.key, enemy)) {
            enemy.speedX = 1;
            return true;
        }
        return false;
    }
    else {
        enemy.speedX = 1;
        return true;
    }

}


function updateEnemyMovement(enemy, check) {
    if (enemy.key === LEFT && enemy.moves[0] && isEnemyTenDivison(enemy)) {
        enemy.speedY = 0;
        if (moveEnemyleft(enemy, check)) {
            enemy.moves[2] = true; // right
            //currentDirection = 37// "left";
        }

    }
    if (enemy.key === UP && enemy.moves[1] && isEnemyTenDivison(enemy)) {
        enemy.speedX = 0;
        if (moveEnemyup(enemy, check)) {
            enemy.moves[3] = true; // down
            //currentDirection = 38 //"up";
        }
    }
    if (enemy.key === RIGHT && enemy.moves[2] && isEnemyTenDivison(enemy)) {
        enemy.speedY = 0;
        if (moveEnemyright(enemy, check)) {
            enemy.moves[0] = true; // left
            //currentDirection = 39 //"right";
        }
    }
    if (enemy.key === DOWN && enemy.moves[3] && isEnemyTenDivison(enemy)) {
        enemy.speedX = 0;
        if (moveEnemydown(enemy, check)) {
            enemy.moves[1] = true; //up
            //currentDirection = 40 //"down";
        }
    }
}

function isEnemyTenDivison(enemy) {
    if (enemy.x % 10 === 0 && enemy.y % 10 === 0) {
        return true;
    }
    return false;
}


// when the enemy get stuck with obstacle- it need to change direction, to move.
function changeDirectionEnemy(enemy) {
    for (var i = 0; i < enemy.moves.length; i++) {
        if (enemy.moves[i]) {
            //enemy.key = i + 37; // so it will fit the direction
            var dir = i + 37;
            var xSpeed = 0;
            var ySpeed = 0;
            switch (i) {
                case (0):
                    xSpeed = -1;
                    break;
                case (1):
                    xSpeed = 1;
                    break;
                case (2):
                    ySpeed = -1;
                    break;
                case (3):
                    ySpeed = 1;
                    break;
            }
            console.log("key 0:" + enemy.key);
            console.log("moves 0:" + enemy.moves);
            enemy.key = dir;
            enemy.speedX = xSpeed;
            enemy.speedY = ySpeed;
            //updateEnemyMovement(enemy, false);
            console.log("key 1:" + enemy.key);
            console.log("moves 1:" + enemy.moves);
            break;
        }
    }
    canMove(-1, enemy);
}*/

//------------------------------------------------------------------------------






// what to do:
// 2- combine to one functiopn- checkCollison, move(comp)- all the move function(+1, -1)
// 5- change numbers to variables
// handle multitime sdame function- collision