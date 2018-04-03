// Constants
// -------------------------------------------------------------
const PRECENTS_TO_WIN         = 80;
const PIXEL_DROW_UNIT         = 4;
const BALL_SPEED              = 2;
const MES_COLOR               = "white";
const ENEMY_HEIGHT            = 40;
const ENEMY_WIDTH             = 40;
const WALL_HEIGHT             = 40;
const WALL_WIDTH              = 40;
const BALL_HEIGHT             = Math.floor(WALL_HEIGHT * 0.75);
const BALL_WIDTH              = Math.floor(WALL_WIDTH * 0.75);
const DIR_OBJ                 = {37: {speedX: -BALL_SPEED, speedY: 0,           oppositeCode: 39}, // Left key
                                 38: {speedX: 0,           speedY: -BALL_SPEED, oppositeCode: 40}, // Up key
                                 39: {speedX: BALL_SPEED,  speedY: 0,           oppositeCode: 37}, // Right key
                                 40: {speedX: 0,           speedY: BALL_SPEED,  oppositeCode: 38}} // Down key 

// Variables 
// ----------------------------------------------------------------
let audio           = {win: new Audio("../sounds/win.mp3"), 
                       loseLive: new Audio("../sounds/loseLive.mp3"),
                       loseGame: new Audio("../sounds/loseGame.mp3"),
                       background: new Audio("../sounds/background.mp3")}
let occupiedAreaPoint;
let isTouchItself;
let ball            = new Ball(myCanvas.width/2, Math.floor(WALL_HEIGHT * 0.25));
let isPaused        = false;
let code            = null;
let animationFrame  = null;
let startAgain      = false;
let enemySlider     = document.getElementById("enemyRange");
let enemtOutput     = document.getElementById("enemyValue");
let enemyNum        = enemySlider.value;
let liveSlider      = document.getElementById("liveRange");
let liveOutput      = document.getElementById("liveValue");
let lives           = liveSlider.value;
var isMuted         = false;

// Code
// ------------------------------------------------------------------------
function mangListener() {
    enemtOutput.innerHTML = enemySlider.value;
    liveOutput.innerHTML =  liveSlider.value;

    // Update the current enemy slider value (each time you drag the enemySlider handle)
    enemySlider.oninput = function() {
        enemtOutput.innerHTML = this.value;
        enemyNum = this.value;
        startAgain = true;
        myCanvas.focus();
        startGame();
    }

    // Update the current live slider value (each time you drag the liveSlider handle)
    liveSlider.oninput = function() {
        liveOutput.innerHTML = this.value;
        lives = this.value;
        startAgain = true;
        myCanvas.focus();
        startGame();
    }

    // Background sound listener 
    audio.background.addEventListener('ended', function() {
        this.currentTime = 0;
        this.play();
    }, false);

    // Key press listener
    window.addEventListener('keydown', function(key) {
        const SPACE_CODE = 32;
        const P_CODE = 80;
        const M_CODE = 77;
    
        // Check if the key is direction key and is valid
        if((DIR_OBJ[key.keyCode] !== undefined) && 
           (key.keyCode !== code)               && 
           (DIR_OBJ[key.keyCode].oppositeCode !== code)) {
            code = key.keyCode;
        } else if((key.keyCode === SPACE_CODE) && ((isLose()) || (isWin(PRECENTS_TO_WIN)))) { // Check if the key is win\lose key
            // If the game over
            if((lives <= 0) || (isWin(PRECENTS_TO_WIN))) {
                startGame();
            } else {
                // Run over the rows canvas (without the starting walls)
                for(let rowIndex = WALL_HEIGHT; rowIndex < area.height - WALL_HEIGHT; rowIndex++) {
                    // Run over the columns canvas (without the starting walls)
                    for(let colIndex = 0; colIndex < area.width; colIndex++) {
                        // Check if this point is occupied
                        if((area.zone[rowIndex][colIndex] === STATUS_VALUES.ENEMY_INJURED_VALUE) ||
                            (area.zone[rowIndex][colIndex] === STATUS_VALUES.TEMP_OCCUPIED_VALUE)) {
                                area.zone[rowIndex][colIndex] = STATUS_VALUES.AREA_VALUE;
                        }
                    }
                }
    
                initData();
                gameLoop();
            }
        } else if((key.keyCode === P_CODE) && (!isLose())) { // Check if the key is paused key and is valid
            isPaused = !isPaused;
    
            // If the user want to continue
            if(!isPaused) {
                audio.background.play();
                gameLoop();
            }
        }

        // Check if the key is muted key
        if(key.keyCode === M_CODE) {
            isMuted = !isMuted;

            // If the user want to muted the sounds
            if(isMuted) {
                audio.background.muted = true;
                audio.win.muted = true;
                audio.loseLive.muted = true;
                audio.loseGame.muted = true;
            } else {
                audio.background.muted = false;
                audio.win.muted = false;
                audio.loseLive.muted = false;
                audio.loseGame.muted = false;
            }

        }
    })
}

function initEnemyies() {
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);

        // The maximum is inclusive and the minimum is inclusive 
        return (Math.floor(Math.random() * (max - min + 1)) + min); 
    }

    let enemiesArray = [];

    // Initializing all the enemies
    for(let index = 0; index < enemyNum; index++) {
        let x = getRandomInt(WALL_WIDTH, myCanvas.width - WALL_WIDTH - ENEMY_WIDTH);
        let y = getRandomInt(WALL_HEIGHT, myCanvas.height - WALL_HEIGHT - ENEMY_HEIGHT);

        // Find random location that is not at wall place
        while(area.zone[y][x] === STATUS_VALUES.WALL_VALUE) {
            x = getRandomInt(WALL_WIDTH, myCanvas.width - WALL_WIDTH - ENEMY_WIDTH);
            y = getRandomInt(WALL_HEIGHT, myCanvas.height - WALL_HEIGHT - ENEMY_HEIGHT);
        }

        enemiesArray.push(new Enemy(x, y));
    }

    return(enemiesArray);
}

function initData() {
    audio.win.pause();
    audio.win.currentTime = 0
    audio.loseLive.pause();
    audio.loseLive.currentTime = 0
    audio.loseGame.pause();
    audio.loseGame.currentTime = 0
    audio.background.play();
    code = null;
    ball.xCoord = myCanvas.width/2;
    ball.yCoord = Math.floor(WALL_HEIGHT * 0.25);
    isTouchItself = false;
    occupiedAreaPoint = [];
}

function initGame() {
    area.initMatrix(STATUS_VALUES.WALL_VALUE, 0, 0);
    area.initMatrix(STATUS_VALUES.AREA_VALUE, WALL_HEIGHT, WALL_WIDTH);
    Enemy.initEnemyIndex();
    enemies = initEnemyies();
    lives = liveSlider.value;
    initData();
}

function mangIncEnemy() {
    function incSpeedEnemy(indexOfEnemy){
        // Check if the enemy didn't injure at empty area
        if((area.zone[enemies[indexOfEnemy].yCoord + enemies[indexOfEnemy].ySpeed]
                     [enemies[indexOfEnemy].xCoord + enemies[indexOfEnemy].xSpeed] !== STATUS_VALUES.AREA_VALUE)                   ||
           (area.zone[enemies[indexOfEnemy].yCoord + ENEMY_HEIGHT - 1 + enemies[indexOfEnemy].ySpeed]
                     [enemies[indexOfEnemy].xCoord + enemies[indexOfEnemy].xSpeed] !== STATUS_VALUES.AREA_VALUE)                   ||
           (area.zone[enemies[indexOfEnemy].yCoord + enemies[indexOfEnemy].ySpeed]
                     [enemies[indexOfEnemy].xCoord + ENEMY_WIDTH - 1 + enemies[indexOfEnemy].xSpeed] !== STATUS_VALUES.AREA_VALUE) ||
           (area.zone[enemies[indexOfEnemy].yCoord + ENEMY_HEIGHT - 1 + enemies[indexOfEnemy].ySpeed]
                     [enemies[indexOfEnemy].xCoord + ENEMY_WIDTH - 1 + enemies[indexOfEnemy].xSpeed] !== STATUS_VALUES.AREA_VALUE)) {
        // Check if the enemy injured at empty area because of the progress in the Y axis
        if((area.isLeadToWrongValueY(ENEMY_HEIGHT,
                ENEMY_WIDTH, 
                enemies[indexOfEnemy].ySpeed,
                enemies[indexOfEnemy].xCoord,
                enemies[indexOfEnemy].yCoord,
                STATUS_VALUES.AREA_VALUE))) {
                enemies[indexOfEnemy].ySpeed *= -1;
            } 
        
            // Check if the enemy injured at empty area because of the progress in the X axis
            if((area.isLeadToWrongValueX(ENEMY_HEIGHT,
                ENEMY_WIDTH, 
                enemies[indexOfEnemy].xSpeed, 
                enemies[indexOfEnemy].xCoord,
                enemies[indexOfEnemy].yCoord,
                STATUS_VALUES.AREA_VALUE))) {
                enemies[indexOfEnemy].xSpeed *= -1;
            }
        }
        
        enemies[indexOfEnemy].xCoord += enemies[indexOfEnemy].xSpeed;
        enemies[indexOfEnemy].yCoord += enemies[indexOfEnemy].ySpeed;
    }

    function drowEnemyInjured(indexOfEnemy) {
        let findRowIndex = null;
        let findColIndex = null;
        let isInjured = true;

        // Indicates from where to mark the enemy damage if the enemy injured the occupied area
        // Check if the top-left of the enemy injured the occupied area
        if(area.zone[enemies[indexOfEnemy].yCoord + enemies[indexOfEnemy].ySpeed]
                    [enemies[indexOfEnemy].xCoord + enemies[indexOfEnemy].xSpeed] === 
                    STATUS_VALUES.TEMP_OCCUPIED_VALUE) {
            findRowIndex = enemies[indexOfEnemy].yCoord + enemies[indexOfEnemy].ySpeed;
            findColIndex = enemies[indexOfEnemy].xCoord + enemies[indexOfEnemy].xSpeed;
        } else if(area.zone[enemies[indexOfEnemy].yCoord + ENEMY_HEIGHT - 1 + enemies[indexOfEnemy].ySpeed]
                           [enemies[indexOfEnemy].xCoord + enemies[indexOfEnemy].xSpeed] ===
                           STATUS_VALUES.TEMP_OCCUPIED_VALUE) { // Check if the bottom-left of the enemy injured the occupied area
            findRowIndex = enemies[indexOfEnemy].yCoord + ENEMY_HEIGHT - 1 + enemies[indexOfEnemy].ySpeed;
            findColIndex = enemies[indexOfEnemy].xCoord + enemies[indexOfEnemy].xSpeed;
        } else if(area.zone[enemies[indexOfEnemy].yCoord + enemies[indexOfEnemy].ySpeed]
                           [enemies[indexOfEnemy].xCoord + ENEMY_WIDTH - 1 + enemies[indexOfEnemy].xSpeed] ===
                           STATUS_VALUES.TEMP_OCCUPIED_VALUE) { // Check if the top-right of the enemy injured the occupied area
            findRowIndex = enemies[indexOfEnemy].yCoord + enemies[indexOfEnemy].ySpeed;
            findColIndex = enemies[indexOfEnemy].xCoord + ENEMY_WIDTH - 1 + enemies[indexOfEnemy].xSpeed;
        } else if(area.zone[enemies[indexOfEnemy].yCoord + ENEMY_HEIGHT - 1 + enemies[indexOfEnemy].ySpeed]
                           [enemies[indexOfEnemy].xCoord + ENEMY_WIDTH - 1 + enemies[indexOfEnemy].xSpeed] === 
                           STATUS_VALUES.TEMP_OCCUPIED_VALUE) { // Check if the bottom-right of the enemy injured the occupied area
            findRowIndex = enemies[indexOfEnemy].yCoord + ENEMY_HEIGHT - 1 + enemies[indexOfEnemy].ySpeed;
            findColIndex = enemies[indexOfEnemy].xCoord + ENEMY_WIDTH - 1 + enemies[indexOfEnemy].xSpeed;
        } else { // The enemy didn't injure the occupied area
            isInjured = false;
        }

        // Check if the enemy injured the occupied area
        if(isInjured) {
            let rowIndex = findRowIndex;
            let colIndex;
            let stopRowCon = findRowIndex + (Math.sign(enemies[indexOfEnemy].ySpeed) * BALL_HEIGHT);
            let stopColCon = findColIndex + (Math.sign(enemies[indexOfEnemy].xSpeed) * BALL_WIDTH);
            
            // Run over the rows
            while(rowIndex !== stopRowCon) {
                colIndex = findColIndex;
                
                // Run over the columns
                while(colIndex !== stopColCon) {
                    // Check if the location is on occupied point
                    if(area.zone[rowIndex][colIndex] === STATUS_VALUES.TEMP_OCCUPIED_VALUE) {
                        area.zone[rowIndex][colIndex] = STATUS_VALUES.ENEMY_INJURED_VALUE;
                    }

                    colIndex += Math.sign(enemies[indexOfEnemy].xSpeed);
                }

                rowIndex += Math.sign(enemies[indexOfEnemy].ySpeed);
            }
        }
    }

    // Run over all the enemies
    for(let index = 0; index < enemies.length; index++) {
        drowEnemyInjured(index);
        incSpeedEnemy(index);
    }
}

function printTools() {
    // Run over all the enemies
    for(let index = 0; index < enemies.length; index++) {
        Canvas.createImage(enemies[index].img,
                           enemies[index].xCoord,
                           enemies[index].yCoord,
                           ENEMY_WIDTH,
                           ENEMY_HEIGHT);
    }

    Canvas.createImage(ball.img, ball.xCoord, ball.yCoord, BALL_WIDTH, BALL_HEIGHT); 
}

function MangmentKeyEvent() {
    // Direction key pressed
    if(code !== null) {
        // Check if The ball moves toward the horizontal limits
        if((ball.xCoord + BALL_WIDTH + DIR_OBJ[code].speedX < area.width) &&
           (ball.xCoord + DIR_OBJ[code].speedX >= 0)) {
                ball.xCoord += DIR_OBJ[code].speedX;
        }
        
        // Check if The ball moves toward the vertical limits
        if((ball.yCoord + BALL_HEIGHT + DIR_OBJ[code].speedY < area.height) &&
           (ball.yCoord + DIR_OBJ[code].speedY >= 0)) {
                ball.yCoord += DIR_OBJ[code].speedY;
        }
                
        // Check if The ball is on wall area
        if((area.zone[ball.yCoord][ball.xCoord] === STATUS_VALUES.WALL_VALUE) &&
           (area.zone[ball.yCoord + BALL_HEIGHT - 1][ball.xCoord] ===
           STATUS_VALUES.WALL_VALUE)                                          &&
           (area.zone[ball.yCoord][ball.xCoord + BALL_WIDTH - 1] === 
            STATUS_VALUES.WALL_VALUE)                                         &&
           (area.zone[ball.yCoord + BALL_HEIGHT - 1][ball.xCoord + BALL_WIDTH - 1] ===
            STATUS_VALUES.WALL_VALUE)) {
            // Check if The ball occupied some area
            if(occupiedAreaPoint.length > 0) {
                paintOccupiedAreas();
            } 

            occupiedAreaPoint = [];
            code = null;
        }  else {
            mangMarkOccupiedArea();
        }
    }
}

function incEnemyInjured(pixelDrowNun) {
    let isNewArea = true;

    // Run over the rows\columns of the occupied area
    for(let unitIndex = 0; unitIndex < occupiedAreaPoint.length; unitIndex++) {
        // Run over the points in this rows\columns
        for(let pointIndex = 0; pointIndex < occupiedAreaPoint[unitIndex].length; pointIndex++) {
            // Check if this point is at new zone 
            if(area.zone[occupiedAreaPoint[unitIndex][pointIndex].y]
                        [occupiedAreaPoint[unitIndex][pointIndex].x] === STATUS_VALUES.TEMP_OCCUPIED_VALUE) {
               isNewArea = true;
            } else if(isNewArea && area.zone[occupiedAreaPoint[unitIndex][pointIndex].y]
                                            [occupiedAreaPoint[unitIndex][pointIndex].x] === 
                                            STATUS_VALUES.ENEMY_INJURED_VALUE) { // Check if this point is injured by enemy  
                isNewArea = false;
                let before = unitIndex - 1;
                let after = unitIndex + 1;

                // Run until the injured points that before the current rows\columns will over
                while((before >= 0) && 
                      (area.zone[occupiedAreaPoint[before][0].y][occupiedAreaPoint[before][0].x] === STATUS_VALUES.ENEMY_INJURED_VALUE)) {
                    before--;
                }

                // Run until the injured points that after the current rows\columns will over
                while((after < occupiedAreaPoint.length) &&
                      (area.zone[occupiedAreaPoint[after][0].y][occupiedAreaPoint[after][0].x] === STATUS_VALUES.ENEMY_INJURED_VALUE)) {
                    after++;
                }

                // Run as the number of the rows\columns that needded to mark
                for(let index = 0; index < pixelDrowNun; index++) {
                    // Check that the left limit didn't crossed
                    if(before - index >= 0) {
                        // Run over current rows\columns less index
                        for(let secondIndex = 0; secondIndex < occupiedAreaPoint[before - index].length; secondIndex++) {
                            if(area.zone[occupiedAreaPoint[before - index][secondIndex].y]
                                        [occupiedAreaPoint[before - index][secondIndex].x] === STATUS_VALUES.TEMP_OCCUPIED_VALUE) {
                                area.zone[occupiedAreaPoint[before - index][secondIndex].y]
                                         [occupiedAreaPoint[before - index][secondIndex].x] = STATUS_VALUES.ENEMY_INJURED_VALUE;
                            }
                        }
                    }

                    // Check that the right limit didn't crossed
                    if(after + index < occupiedAreaPoint.length) {
                        // Run over current rows\columns plus index
                        for(let secondIndex = 0; secondIndex < occupiedAreaPoint[after + index].length; secondIndex++) {
                            if(area.zone[occupiedAreaPoint[after + index][secondIndex].y]
                                        [occupiedAreaPoint[after + index][secondIndex].x] === STATUS_VALUES.TEMP_OCCUPIED_VALUE) {
                                area.zone[occupiedAreaPoint[after + index][secondIndex].y]
                                         [occupiedAreaPoint[after + index][secondIndex].x] = STATUS_VALUES.ENEMY_INJURED_VALUE;
                            }
                        }
                    }
                }
            }
        }
    }
}

function incBallValidation(ballLoc) {
    let usedPoints = 0;
    let hasOccupiedPoint = false;

    // Run over the ball rows
    for(let rowIndex = ballLoc.y; rowIndex < ballLoc.y + BALL_HEIGHT; rowIndex++) {
        // Run over the ball columns 
        for(let colIndex = ballLoc.x; colIndex < ballLoc.x + BALL_WIDTH; colIndex++) {
            // If the point is already occupied
            if((area.zone[rowIndex][colIndex] === STATUS_VALUES.TEMP_OCCUPIED_VALUE) ||
               (area.zone[rowIndex][colIndex] === STATUS_VALUES.ENEMY_INJURED_VALUE)) {
                usedPoints++;
            }
        }
    }

    // If all the ball points is already occupied
    if(usedPoints === BALL_HEIGHT * BALL_HEIGHT) {
        isTouchItself = true;
    }
}
function mangMarkOccupiedArea() {
    let ballCoord = new Point(ball.xCoord - DIR_OBJ[code].speedX, ball.yCoord - DIR_OBJ[code].speedY)
    let points;
    
    // Run over the ball progress
    for(let stepIndex = 1; stepIndex <= BALL_SPEED; stepIndex++) {
        ballCoord.x += Math.sign(DIR_OBJ[code].speedX);
        ballCoord.y += Math.sign(DIR_OBJ[code].speedY);
        points = []

        incBallValidation(ballCoord)

        // Run over the ball rows
        for(let rowIndex = ballCoord.y; rowIndex < ballCoord.y + BALL_HEIGHT; rowIndex++) {
            // Run over the ball columns 
            for(let colIndex = ballCoord.x; colIndex < ballCoord.x + BALL_WIDTH; colIndex++) {
                // Check if this point is new point 
                // if((area.zone[rowIndex][colIndex] === STATUS_VALUES.AREA_VALUE) ||
                //    (area.zone[rowIndex][colIndex] === STATUS_VALUES.WALL_VALUE)) {
                //     points.push(new Point(colIndex, rowIndex));
                
                    // If the point is empty area
                    if(area.zone[rowIndex][colIndex] === STATUS_VALUES.AREA_VALUE) {
                        points.push(new Point(colIndex, rowIndex));
                        area.zone[rowIndex][colIndex] = STATUS_VALUES.TEMP_OCCUPIED_VALUE;
                    }
                // }
            }
        }

        // Check if has new area
        // if(points.length === 0) {
        //     isTouchItself = true;
        // } else {
            occupiedAreaPoint.push(points);
            // isTouchItself = false;
        // }
    }
}

function gameLoop() {
    // Check if was a slider input 
    if(startAgain) {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
    }   

    // restartGame();
    Canvas.printArea();
    printTools();

    // If the user won
    if(isWin(PRECENTS_TO_WIN)) {
        const WIN_TEXT = "YOU WIN!!!. PRESS SPACE TO RESTART"

        audio.background.pause();
        audio.win.play();
        Canvas.createText(WIN_TEXT, MES_COLOR, myCanvas.width/2, myCanvas.height/2, "center");
    } else if(isLose()) { // If the user lose
        const LOST_LIVE_TEXT = "SO BAD, YOU LOST A LIVE, PRESS SPACE TO CONTINUE";  
        const LOSE_TEXT = "YOU LOSE!!!. PRESS SPACE TO RESTART";
        
        lives--;
        audio.background.pause();

        // If the live is over
        if(lives <= 0) {
            audio.loseGame.play();
            Canvas.createText(LOSE_TEXT, MES_COLOR, myCanvas.width/2, myCanvas.height/2, "center");
        } else {
            audio.loseLive.play();
            Canvas.createText(LOST_LIVE_TEXT, MES_COLOR, myCanvas.width/2, myCanvas.height/2, "center");
        }
    } else if(isPaused) { // If the game is paused
        const PAUSED_TEXT = "PAUSED";

        Canvas.createText(PAUSED_TEXT, MES_COLOR, myCanvas.width/2, myCanvas.height/2, "center");
        audio.background.pause();
    } else {
        MangmentKeyEvent();
        
        // If the ball is moving
        if(code !== null) {
            incEnemyInjured(PIXEL_DROW_UNIT);
        }

        mangIncEnemy();
        printGamerInfo();
        animationFrame = requestAnimationFrame(gameLoop);
    }
}

function isLose() {
    let isFail = false;

    // Run over all the enemy
    for(let enemyIndex = 0; enemyIndex < enemies.length; enemyIndex++) {
        // Check if the enemy is on the ball zone
        if((((enemies[enemyIndex].yCoord >= ball.yCoord)                                   ||
             (enemies[enemyIndex].yCoord + ENEMY_HEIGHT - 1 >= ball.yCoord))               &&
            ((enemies[enemyIndex].yCoord < ball.yCoord + BALL_HEIGHT)                      ||
             (enemies[enemyIndex].yCoord + ENEMY_HEIGHT - 1 < ball.yCoord + BALL_HEIGHT))) &&
           (((enemies[enemyIndex].xCoord >= ball.xCoord)                                   ||
             (enemies[enemyIndex].xCoord + ENEMY_WIDTH - 1 >= ball.xCoord))                && 
            ((enemies[enemyIndex].xCoord < ball.xCoord + BALL_WIDTH)                       ||
                (enemies[enemyIndex].xCoord + ENEMY_WIDTH - 1 < ball.xCoord + BALL_WIDTH)))) {
                isFail = true;

                break;
        }
    }
    
    // If the user didn't fail yet
    if(!isFail) {
        const BALL_PIXEL = BALL_HEIGHT * BALL_WIDTH;

        let enemyInjuredIndex = 0;
        let wallIndex = 0;
       
        loop5:
        // Run over the ball rows
        for(let ballRowIndex = ball.yCoord; ballRowIndex < ball.yCoord + BALL_HEIGHT; ballRowIndex++) {
            // Run over the ball columns 
            for(let ballColIndex = ball.xCoord; ballColIndex < ball.xCoord +  BALL_WIDTH; ballColIndex++) {
                // Check how many point injured by enemy at the ball zone
                if(area.zone[ballRowIndex][ballColIndex] === STATUS_VALUES.ENEMY_INJURED_VALUE) {
                    enemyInjuredIndex++
                } else if(area.zone[ballRowIndex][ballColIndex] === 
                          STATUS_VALUES.WALL_VALUE) { // Check how many point at the ball zone is wall
                    wallIndex++;
                }
            }
        }

        // Check if all the ball zone is injured by enemy or if the ball cross the occupied area
        if(((enemyInjuredIndex > 0) && (enemyInjuredIndex + wallIndex === BALL_PIXEL)) || (isTouchItself)) {
            isFail = true;
        }
    }

    // If the user didn't fail yet and the beginning of the occupied area is injured by enemy
    if((!isFail)                       && 
        (occupiedAreaPoint.length > 0) && 
        (area.zone[occupiedAreaPoint[0][0].y][occupiedAreaPoint[0][0].x] === STATUS_VALUES.ENEMY_INJURED_VALUE)) {
        isFail = true;
    }

    return(isFail);
}

function paintOccupiedAreas() {

    // Run over all the enemies and mark area that occupied by the enemies
    for(let index = 0; index < enemies.length; index++) {
        markEnemiesAreas(new Point(enemies[index].xCoord, enemies[index].yCoord), STATUS_VALUES.OCCUPIED_ENEMY_VALUE);
    }

    // Run over the rows canvas (without the starting walls)
    for(let rowIndex = WALL_HEIGHT; rowIndex < area.height - WALL_HEIGHT; rowIndex++) {
        // Run over the columns canvas (without the starting walls)
        for(let colIndex = WALL_WIDTH; colIndex < area.width - WALL_WIDTH; colIndex++) {
            // Check if the point occupied by the enemies or not
            if(area.zone[rowIndex][colIndex] === STATUS_VALUES.OCCUPIED_ENEMY_VALUE) {
                area.zone[rowIndex][colIndex] = STATUS_VALUES.AREA_VALUE;
            } else {
                area.zone[rowIndex][colIndex] = STATUS_VALUES.WALL_VALUE;
            }
        }
    }
}

function markEnemiesAreas(point, occupiedByEnemyValue) {

    let enemiesAreas = [point];

    // Stop conditions for the recursive function (all the points ended)
    while(enemiesAreas.length > 0) {
        let currPoint = enemiesAreas.pop();

        // Check if the current point is empty area
        if(area.zone[currPoint.y][currPoint.x] === STATUS_VALUES.AREA_VALUE) {
            area.zone[currPoint.y][currPoint.x] = occupiedByEnemyValue;
        }
    
        // Check if the up point is empty area
        if(area.zone[currPoint.y + 1][currPoint.x] === STATUS_VALUES.AREA_VALUE) {
            enemiesAreas.push(new Point(currPoint.x, currPoint.y + 1))
        }
    
        // Check if the down point is empty area
        if(area.zone[currPoint.y - 1][currPoint.x] === STATUS_VALUES.AREA_VALUE) {
            enemiesAreas.push(new Point(currPoint.x, currPoint.y - 1))
        }
    
        // Check if the right point is empty area
        if(area.zone[currPoint.y][currPoint.x + 1] === STATUS_VALUES.AREA_VALUE) {
            enemiesAreas.push(new Point(currPoint.x + 1, currPoint.y))
        }
    
        // Check if the left point is empty area
        if(area.zone[currPoint.y][currPoint.x - 1] === STATUS_VALUES.AREA_VALUE) {
            enemiesAreas.push(new Point(currPoint.x - 1, currPoint.y))
        }
    }
}

function isWin(percents) {
    let occupiedAreaSum = totalOccupiedArea();

    // Check if the occupied area is equal or more than the goal
    if(occupiedAreaSum >= percents) {
        return(true);
    }

    return(false);
}

function totalOccupiedArea() {
    let sum = 0;
    let ZONE_SIZE = area.height * area.width;

    // Run over the rows canvas (include the starting walls)
    for(let rowIndex = 0; rowIndex < area.height; rowIndex++) {
        // Run over the columns canvas (include the starting walls)
        for(let colIndex = 0; colIndex < area.width; colIndex++) {
            // Check if the point is on wall
            if(area.zone[rowIndex][colIndex] === STATUS_VALUES.WALL_VALUE) {
                sum++;
            }
        }
    }

    return(Math.round(sum * 100 / ZONE_SIZE));
}

function printGamerInfo() {
    const X = 50;
    const Y = 60;

    Canvas.createText("Progress: " + totalOccupiedArea() + "%  /  " + PRECENTS_TO_WIN + "%", MES_COLOR, X, Y, "left");
    Canvas.createText("Lives: " + lives, MES_COLOR, myCanvas.width - X, Y, "right");
}

function startGame() {
    initGame();
    gameLoop();
}

mangListener();
startGame();