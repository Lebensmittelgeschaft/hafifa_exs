

var pacman;
var enemyList = [];
var foodList = [];
var maze = [];
var currentDirection = "";
var moveOptions = [true, true, true, true];


function startGame() {
    pacman = new component(15, 15, "images/pacman.png", 10, 100, "image");
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
        console.log(foodList);
        this.interval = setInterval(updateGameArea, 40);
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
    window.addEventListener('keyup', function (e) {
        pacman.key = false;
    })
}

function updateMovement() {
    if (pacman.key && pacman.key == 37 && moveOptions[0]) {
        pacman.speedY = 0;
        currentDirection = "left";
        moveleft();
        moveOptions[1] = true;

    }
    if (pacman.key && pacman.key == 39 && moveOptions[1]) {
        pacman.speedY = 0;
        currentDirection = "right";
        moveright();
        moveOptions[0] = true;
    }
    if (pacman.key && pacman.key == 38 && moveOptions[2]) {
        console.log(moveOptions);
        pacman.speedX = 0;
        currentDirection = "up";
        moveup();
        moveOptions[3] = true;
    }
    if (pacman.key && pacman.key == 40 && moveOptions[3]) {
        pacman.speedX = 0;
        currentDirection = "down";
        movedown();
        moveOptions[2] = true;
    }
}

function canMove(index) {
    console.log(moveOptions.length);
    for (var i = 0; i < moveOptions.length; i++) {
        if (index === i) {
            console.log("false");
            moveOptions[i] = false;
        }
        else {
            moveOptions[i] = true;
        }
    }
    console.log(moveOptions);
}

function inEnemySpace(left, right, down, up) {
    // Enemy Space
    if (pacman.x > left && pacman.x < right && pacman.y > down && pacman.y < up) {
        return true;
    }
    return false;
}

function checkCollision() {
    /*if (checkCollisionDown() || checkCollisionLeft() ||
        checkCollisionRight() || checkCollisionUp()) {
        clearmove();
    }*/
    var width = gameArea.canvas.width;
    var height = gameArea.canvas.height;


    switch (currentDirection) {
        case ("right"):
            if (pacman.x > width - 25 || inEnemySpace(95,190,50,100)) {
                clearmove();
                canMove(1);
            }
            //else { checkCollisionRight(); }
            break;
        case ("left"):
            if (pacman.x < 10 || inEnemySpace(110,193,50,100)) {
                clearmove();
                canMove(0);
            }
            //else { checkCollisionLeft(); }
            break;
        case ("up"):
            if (pacman.y < 10 || inEnemySpace(100,190,50,103)) {
                clearmove();
                canMove(2);
            }
            //else { checkCollisionUp(); }
            break;
        case ("down"):
            if (pacman.y > height - 25 || inEnemySpace(110,190,35,100)) {
                clearmove();
                canMove(3);
            }
            //else { checkCollisionDown(); }
            break;
    }
}

function checkCollisionRight() {
    for (var i = 0; i < maze.length; i++) {
        //console.log("maze" + maze[i].y);
        if (pacman.y > maze[i].y - 5 &&
            pacman.x > maze[i].x - 5) {
            clearmove();
            break;
        }
    }
}

function checkCollisionLeft() {
    for (var i = 0; i < maze.length; i++) {
        //console.log("maze" + maze[i].y);
        if (pacman.y < maze[i].y + 5 &&
            pacman.x < maze[i].x + 5) {
            clearmove();
            break;
        }
    }
}


function checkCollisionUp() {
    //console.log("pac" + pacman.y);
    for (var i = 0; i < maze.length; i++) {
        //console.log("maze" + maze[i].y);
        if (pacman.y < maze[i].y + 5 &&
            pacman.x < maze[i].x + 5) {
            clearmove();
            break;
        }
    }
}


function checkCollisionDown() {
    //console.log("pac" + pacman.y);
    for (var i = 0; i < maze.length; i++) {
        //console.log("maze" + maze[i].y);
        if (pacman.y > maze[i].y - 5 &&
            pacman.x > maze[i].x - 5) {
            clearmove();
            break;
        }
    }
}


/*function createGrid() {
    var width = gameArea.canvas.width;
    var height = gameArea.canvas.height;
    ctx = gameArea.context;
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1;
    for (var i = 1; i < width; i = i+15) {
        ctx.moveTo(i,0);
        ctx.lineTo(i, width);
        ctx.stroke();
    }
    for (var j = 1; j < height; j = j+15) {
        ctx.moveTo(0, j);
        ctx.lineTo(height, j);
        ctx.stroke();
    }
}*/


function createEnemys() {
    var colors = ["red", "green", "pink", "yellow"];
    var enemy = new component(15, 15, "images/ghost-" + colors[0] + ".gif", 130, 60, "image");
    enemyList.push(enemy);
    var enemy = new component(15, 15, "images/ghost-" + colors[1] + ".gif", 130, 80, "image");
    enemyList.push(enemy);
    var enemy = new component(15, 15, "images/ghost-" + colors[2] + ".gif", 160, 60, "image");
    enemyList.push(enemy);
    var enemy = new component(15, 15, "images/ghost-" + colors[3] + ".gif", 160, 80, "image");
    enemyList.push(enemy);

}

function createFood() {
    var width = gameArea.canvas.width;
    var height = gameArea.canvas.height;
    for (var i = 1; i < 20; i++) {
        for (var j = 1; j < 10; j++) {
            if (i > 7 && i < 13 && j > 3 && j < 7) {
                continue;
            }
            var food = new component(50, 50, "white", 15 * i, 15 * j, "food");
            foodList.push(food);
        }
    }
}


function createMaze() {
    var width = gameArea.canvas.width;
    var height = gameArea.canvas.height;

    // Frame
    // upper-left
    var obstacle = new component(width / 2 - 40, 1, "blue", 5, 5, "obstacle");
    maze.push(obstacle);

    // upper-right
    var obstacle = new component(width / 2 - 40, 1, "blue", width / 2 + 35, 5, "obstacle");
    maze.push(obstacle);

    // left-up
    var obstacle = new component(1, height / 2 - 20, "blue", 5, 5, "obstacle");
    maze.push(obstacle);

    // left-down
    var obstacle = new component(1, height / 2 - 20, "blue", 5, height / 2 + 15, "obstacle");
    maze.push(obstacle);


    // down-left
    var obstacle = new component(width / 2 - 40, 1, "blue", 5, height - 5, "obstacle");
    maze.push(obstacle);

    // down-right
    var obstacle = new component(width / 2 - 40, 1, "blue", width / 2 + 35, height - 5, "obstacle");
    maze.push(obstacle);

    // right-up
    var obstacle = new component(1, height / 2 - 20, "blue", width - 5, 5, "obstacle");
    maze.push(obstacle);

    // right-down
    var obstacle = new component(1, height / 2 - 20, "blue", width - 5, height / 2 + 15, "obstacle");
    maze.push(obstacle);


    // Enemy space- up
    for (var i = 0; i < 8; i++) {
        var obstacle = new component(10, 1, "blue", 110 + 10 * i, 50, "obstacle");
        maze.push(obstacle);
    }
    // Enemy space- down
    for (var i = 0; i < 8; i++) {
        var obstacle = new component(10, 1, "blue", 110 + 10 * i, 100, "obstacle");
        maze.push(obstacle);
    }

    // Enemy space- left
    for (var i = 0; i < 5; i++) {
        var obstacle = new component(1, 10, "blue", 110, 50 + 10 * i, "obstacle");
        maze.push(obstacle);
    }
    // Enemy space- right
    for (var i = 0; i < 5; i++) {
        var obstacle = new component(1, 10, "blue", 190, 50 + 10 * i, "obstacle");
        maze.push(obstacle);
    }
}



function component(width, height, color, x, y, type) {
    this.type = type;
    if (type == "image") {
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
        switch (type) {
            case ("image"):
                ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
                break;
            case ("food"):
                ctx.beginPath();
                ctx.arc(this.x, this.y, 1, 0, Math.PI * 2);
                ctx.stroke();
                ctx.fillStyle = color;
                ctx.fill();
                //ctx.fill (this.x, this.y, this.width, this.height);
                break;
            case ("obstacle"):
                ctx.fillStyle = color;
                ctx.fillRect(this.x, this.y, this.width, this.height);
                break;

        }
    }
    this.newPos = function () {
        this.x += this.speedX;
        this.y += this.speedY;
    }
}

function updateGameArea() {
    gameArea.clear();
    pacman.newPos();
    pacman.update();
    //checkCollision();
    checkCollision();
    for (var i = 0; i < enemyList.length; i++) {
        enemyList[i].update();
    }
    for (var i = 0; i < foodList.length; i++) {
        foodList[i].update();
    }
    for (var i = 0; i < maze.length; i++) {
        maze[i].update();
    }
    updateMovement();
}

function moveup() {
    pacman.speedY = -2;
}

function movedown() {
    pacman.speedY = 2;
}

function moveleft() {
    pacman.speedX = -2;
}

function moveright() {
    pacman.speedX = 2;
}

function clearmove() {
    pacman.speedX = 0;
    pacman.speedY = 0;
}

/*function stopMove() {
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0; 
}*/
