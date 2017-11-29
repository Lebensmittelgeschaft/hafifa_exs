

var pacman;
var enemyList = [];
var foodList = [];
var maze = [];
var currentDirection = "";


function startGame() {
    //pacman = new component(10, 10, "images/pacman.png", 10, 10, "image");
    pacman = new component(10, 10, "yellow", 30, 30, "obstacle", "pacman");
    gameArea.start();
}

var gameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        //createGrid();
        createEnemys();
        createFood();
        createMaze();
        //console.log(foodList);
        this.interval = setInterval(updateGameArea, 20);
        addKeyListener();
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop: function () {
        clearInterval(this.interval);
    }
}

function addKeyListener() {
    window.addEventListener('keydown', function (e) {
        pacman.key = e.keyCode;
    })
}

function updateMovement() {
    if (pacman.key && pacman.key == 37 && pacman.moves[0] && isTenDivison()) {
        pacman.speedY = 0;
        if (moveleft()) {
            pacman.moves[2] = true; // right
            currentDirection = 37// "left";
        }

    }
    if (pacman.key && pacman.key == 38 && pacman.moves[1] && isTenDivison()) {
        pacman.speedX = 0;
        if (moveup()) {
            pacman.moves[3] = true; // down
            currentDirection = 38 //"up";
        }
    }
    if (pacman.key && pacman.key == 39 && pacman.moves[2] && isTenDivison()) {
        pacman.speedY = 0;
        if (moveright()) {
            pacman.moves[0] = true; // left
            currentDirection = 39 //"right";
        }
    }
    if (pacman.key && pacman.key == 40 && pacman.moves[3] && isTenDivison()) {
        pacman.speedX = 0;
        if (movedown()) {
            pacman.moves[1] = true; //up
            currentDirection = 40 //"down";
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

function checkCollision(key, direction, comp) {
    /*if (checkCollisionDown() || checkCollisionLeft() ||
        checkCollisionRight() || checkCollisionUp()) {
        clearmove();
    }*/
    var width = gameArea.canvas.width;
    var height = gameArea.canvas.height;

    switch (key) {
        //case ("right"):
        case (39):
            if (comp.x >= width - 20 || inEnemySpace(100, 185, 45, 95, comp)) {
                if (direction !== key) {
                    if (checkCollision(direction, direction, comp)) {
                        clearmove(comp);
                    }
                }
                else {
                    clearmove(comp);
                }
                canMove(2, comp);
                if (comp.type === "enemy") {
                    changeDirectionEnemy(comp);
                    console.log("key after:" + comp.key);
                    console.log("moves after:" + comp.moves);
                }
                return true;
            }
            else { comp.moves[2] = true; }
            //else { checkCollisionRight(); }
            return false;;
        //case ("left"):
        case (37):
            if (comp.x <= 10 || inEnemySpace(115, 190, 45, 95, comp)) {
                if (direction !== key) {
                    if (checkCollision(direction, direction, comp)) {
                        clearmove(comp);
                    }
                }
                else {
                    clearmove(comp);
                }
                canMove(0, comp);
                if (comp.type === "enemy") {
                    changeDirectionEnemy(comp);
                    console.log("key after:" + comp.key);
                    console.log("moves after:" + comp.moves);
                }
                return true;
            }
            else { comp.moves[0] = true; }
            //else { checkCollisionLeft(); }
            return false;;
        //case ("up"):
        case (38):
            if (comp.y <= 10 || inEnemySpace(105, 185, 45, 100, comp)) {
                if (direction !== key) {
                    if (checkCollision(direction, direction, comp)) {
                        clearmove(comp);
                    }
                }
                else {
                    clearmove(comp);
                }
                canMove(1, comp);
                if (comp.type === "enemy") {
                    changeDirectionEnemy(comp);
                    console.log("key after:" + comp.key);
                    console.log("moves after:" + comp.moves);
                }
                return true;
            }
            else { comp.moves[1] = true; }
            //else { checkCollisionUp(); }
            return false;;
        //case ("down"):
        case (40):
            if (comp.y >= height - 20 || inEnemySpace(105, 185, 40, 95, comp)) {
                if (direction !== key) {
                    if (checkCollision(direction, direction, comp)) {
                        clearmove(comp);
                    }
                }
                else {
                    clearmove(comp);
                }
                canMove(3, comp);
                if (comp.type === "enemy") {
                    changeDirectionEnemy(comp);
                    console.log("key after:" + comp.key);
                    console.log("moves after:" + comp.moves);
                }
                return true;
            }
            else { comp.moves[3] = true; }
            //else { checkCollisionDown(); }
            return false;;
    }
    return false;
}

function isTenDivison() {
    if (pacman.x % 10 === 0 && pacman.y % 10 === 0) {
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
                ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
                break;
            case ("food"):
                ctx.beginPath();
                ctx.arc(this.x, this.y, 1, 0, Math.PI * 2);
                ctx.stroke();
                ctx.fillStyle = this.color;
                ctx.fill();
                //ctx.fill (this.x, this.y, this.width, this.height);
                break;
            case ("obstacle"):
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
        if (pacman.x + 5 === foodList[i].x && pacman.y + 5 === foodList[i].y) {
            foodList.splice(i, 1);
            break;
        }
    }
}

function updateGameArea() {
    gameArea.clear();
    fillCell();
    eatFood();
    updateMovement();
    pacman.newPos();
    pacman.update();
    checkCollision(pacman.key, currentDirection, pacman);
    for (var i = 0; i < 1//enemyList.length
        ; i++) {
        moveEnemy(enemyList[i]);
        enemyList[i].newPos();
        enemyList[i].update();
        checkCollision(enemyList[i].key, enemyList[i].key, enemyList[i]);
    }
    for (var i = 0; i < foodList.length; i++) {
        foodList[i].update();
    }
    for (var i = 0; i < maze.length; i++) {
        maze[i].update();
    }
}

function moveup() {
    if (!checkCollision(pacman.key, currentDirection, pacman)) {
        pacman.speedY = -1;
        return true;
    }
    return false;
}

function movedown() {
    if (!checkCollision(pacman.key, currentDirection, pacman)) {
        pacman.speedY = 1;
        return true;
    }
    return false;
}

function moveleft() {
    if (!checkCollision(pacman.key, currentDirection, pacman)) {
        pacman.speedX = -1;
        return true;
    }
    return false;
}

function moveright() {
    if (!checkCollision(pacman.key, currentDirection, pacman)) {
        pacman.speedX = 1;
        return true;
    }
    return false;
}

function clearmove(comp) {
    if (comp.type === "enemy") {
        return;
    }
    else {
        comp.speedX = 0;
        comp.speedY = 0;
    }

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

function createMaze() {
    var width = gameArea.canvas.width;
    var height = gameArea.canvas.height;
    for (var i = 0; i < width; i = i + 10) {
        for (var j = 0; j < height; j = j + 10) {
            switch (i) {
                case (0):
                    var obstacle = new component(width - 10, 1, "blue", 5, 5, "obstacle", "obstacle");
                    maze.push(obstacle);
                    var obstacle = new component(width / 2 - 20, 1, "green", 80, 5, "obstacle", "obstacle");
                    maze.push(obstacle);
                case (width - 1):
                    var obstacle = new component(width - 10, 1, "blue", 5, height - 5, "obstacle", "obstacle");
                    maze.push(obstacle);
                    var obstacle = new component(width / 2 - 20, 1, "green", 80, height - 5, "obstacle", "obstacle");
                    maze.push(obstacle);
            }
            switch (j) {
                case (0):
                    var obstacle = new component(1, height - 10, "blue", 5, 5, "obstacle", "obstacle");
                    maze.push(obstacle);
                    var obstacle = new component(1, height / 2 - 20, "green", 5, 50, "obstacle", "obstacle");
                    maze.push(obstacle);
                case (height - 1):
                    var obstacle = new component(1, height - 10, "blue", width - 5, 5, "obstacle", "obstacle");
                    maze.push(obstacle);
                    var obstacle = new component(1, height / 2 - 20, "green", width - 5, 50, "obstacle", "obstacle");
                    maze.push(obstacle);
            }
        }
    }
    // Enemy space- up
    for (var i = 0; i < 7; i++) {
        var obstacle = new component(10, 1, "blue", 115 + 10 * i, 55, "obstacle", "obstacle");
        maze.push(obstacle);
    }
    // Enemy space- down
    for (var i = 0; i < 7; i++) {
        var obstacle = new component(10, 1, "blue", 115 + 10 * i, 95, "obstacle", "obstacle");
        maze.push(obstacle);
    }

    // Enemy space- left
    for (var i = 0; i < 4; i++) {
        var obstacle = new component(1, 10, "blue", 115, 55 + 10 * i, "obstacle", "obstacle");
        maze.push(obstacle);
    }
    // Enemy space- right
    for (var i = 0; i < 4; i++) {
        var obstacle = new component(1, 10, "blue", 185, 55 + 10 * i, "obstacle", "obstacle");
        maze.push(obstacle);
    }
}



function createEnemys() {
    var colors = ["red", "green", "pink", "yellow"];
    //var enemy = new component(10, 10, "images/ghost-" + colors[0] + ".gif", 130, 60, "image");
    var enemy = new component(10, 10, "images/ghost-" + colors[0] + ".gif", 60, 60, "image", "enemy");
    enemyList.push(enemy);
    //var enemy = new component(10, 10, "images/ghost-" + colors[1] + ".gif", 130, 80, "image");
    var enemy = new component(10, 10, "images/ghost-" + colors[1] + ".gif", 80, 80, "image", "enemy");
    enemyList.push(enemy);
    //var enemy = new component(10, 10, "images/ghost-" + colors[2] + ".gif", 160, 60, "image");
    var enemy = new component(10, 10, "images/ghost-" + colors[2] + ".gif", 100, 100, "image", "enemy");
    enemyList.push(enemy);
    //var enemy = new component(10, 10, "images/ghost-" + colors[3] + ".gif", 160, 80, "image");
    var enemy = new component(10, 10, "images/ghost-" + colors[3] + ".gif", 10, 10, "image", "enemy");
    enemyList.push(enemy);

}

function createFood() {
    var width = gameArea.canvas.width;
    var height = gameArea.canvas.height;
    var color;
    for (var i = 15; i < width - 10; i = i + 10) {
        for (var j = 15; j < height - 10; j = j + 10) {
            color = "white";
            /*if () {
                color = "red";
            }*/
            if (i > 105 && i < 195 && j > 45 && j < 105) {
                continue;
            }
            var food = new component(50, 50, color, i, j, "food", "food");
            foodList.push(food);
        }
    }
}


function moveEnemy(enemy) {
    enemy.key = Math.floor((Math.random() * 4) + 37); // choose random dir- 37 = left, 39 = right 38 - up, 40 - down
    updateEnemyMovement(enemy, true);
}



//---------------------- copy of move funcs to enemy ----------------------

function moveEnemyup(enemy, check) {
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
    if (enemy.key === 37 && enemy.moves[0] && isEnemyTenDivison(enemy)) {
        enemy.speedY = 0;
        if (moveEnemyleft(enemy, check)) {
            enemy.moves[2] = true; // right
            //currentDirection = 37// "left";
        }

    }
    if (enemy.key === 38 && enemy.moves[1] && isEnemyTenDivison(enemy)) {
        enemy.speedX = 0;
        if (moveEnemyup(enemy, check)) {
            enemy.moves[3] = true; // down
            //currentDirection = 38 //"up";
        }
    }
    if (enemy.key === 39 && enemy.moves[2] && isEnemyTenDivison(enemy)) {
        enemy.speedY = 0;
        if (moveEnemyright(enemy, check)) {
            enemy.moves[0] = true; // left
            //currentDirection = 39 //"right";
        }
    }
    if (enemy.key === 40 && enemy.moves[3] && isEnemyTenDivison(enemy)) {
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
}

//------------------------------------------------------------------------------






// what to do:
// 1- combine function- comp
// 2- combine to one functiopn- checkcolliosn, move(comp)- all the move function(+1, -1)

// 5- change numbers to variables
// 6- change drawType: obstacle-> square, food-> circle

//////////////////////////
/*
function handleCollision(direction, key, comp, index) {
    if (comp.type == "enemy") {
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
//}



//old:
/*
function handleCollision(direction, key, comp, index) {
    if (direction !== key) {
        if (checkCollision(direction, direction, comp)) {
            clearmove(comp);
        }
        else {
            if (comp.type === "pacman") {
                moveThrow(comp);
            }
        }
    }
    else {
        if (comp.type == "enemy") {
            //changeDirection(comp);
            //while
            //if (isTenDivison(comp)) {
                clearmove(comp);
            //}
            //comp.newPos();
            //comp.update();
            //}

        }
        else { //pacman
            if (!moveThrow(comp)) {
                clearmove(comp);
            }
        }
    }
    canMove(index, comp);
    /*if (comp.type === "enemy") {
        changeDirectionEnemy(comp);
        console.log("key after:" + comp.key);
        console.log("moves after:" + comp.moves);
    }*/
//}