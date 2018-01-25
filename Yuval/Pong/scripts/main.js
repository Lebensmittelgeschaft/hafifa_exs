// Consts
const BOARD_WIDTH       = 400;
const BOARD_HEIGHT      = 600;
const WINNING_SCORE     = 3;
const PAUSE_KEY         = 32;  
const FRAMES_PER_SEC    = 60;
const PADDLE_HEIGHT     = 10;
const PADDLE_WIDTH      = 50;
const PADDLE_X_POSITION = BOARD_WIDTH / 2 - PADDLE_WIDTH / 2;
const MAX_DIFF_CPU_BALL = 5;
const DIFF_PADDLE_BOARD = 10;
const BALL_RADIUS       = 5;

// Vars
var canvas       = document.getElementById("canvas");
var context      = canvas.getContext('2d');
var typeOfGame   = "cpu";
var timeoutID;
var isGamePaused = false;
var winnerPlayer = "";
// Create audio for paddles and walls
var paddleAudio  = new Audio("sounds/boop_paddle.mp3");
var wallAudio    = new Audio("sounds/beep_wall.mp3");
// Get from local storage if sound is muted or not
var isAudioOn    = localStorage.getItem('muted') == null ? true : localStorage.getItem('muted') === "false";
// All pressed keys
var keysDown     = {};
// Get the radio buttons of game type
var gameChoice1  = document.getElementById("gameChoice1")
var gameChoice2  = document.getElementById("gameChoice2")

// Setting board sizes
canvas.width  = BOARD_WIDTH;
canvas.height = BOARD_HEIGHT;

setSound(isAudioOn);

// Class represents a player instance in the game (can be cpu or human)
class Player {
    constructor(height, playerType, right, left, titleDiv) {
        this.paddle = new Paddle(PADDLE_X_POSITION, height, PADDLE_WIDTH, PADDLE_HEIGHT);
        this.playerType = playerType;
        this.right = right;
        this.left = left;
        this.playerScore = 0;
        this.titleDiv = titleDiv;
    }

    render() {
        this.paddle.render();
    }

    update(ball) {
        // Sets the border of keys images to black
        this.titleDiv.querySelectorAll("img")[0].style.border = "3px solid black";
        this.titleDiv.querySelectorAll("img")[1].style.border = "3px solid black";
        this.titleDiv.querySelector("h3").innerHTML = this.playerType;

        // Check whether the player is cpu or human
        if (this.playerType == "cpu") {
            var x_pos = ball.x;
            var diff = -((this.paddle.x + (this.paddle.width / 2)) - x_pos);
            
            // Check diff between ball center X axis to cpu paddle middle x axis 
            if (diff < -MAX_DIFF_CPU_BALL) {
                diff = -MAX_DIFF_CPU_BALL;
            } else if (diff > MAX_DIFF_CPU_BALL) {
                diff = MAX_DIFF_CPU_BALL;
            }

            this.paddle.move(diff, 0);

            if (this.paddle.x < 0) {
                this.paddle.x = 0;
            } else if (this.paddle.x + this.paddle.width > BOARD_WIDTH) {
                this.paddle.x = BOARD_WIDTH - this.paddle.width;
            }
        } else { // Player is human
            var moved = false;

            for (var key in keysDown) {
                var value = Number(key);
                
                // Player moved left
                if (value == this.left) {
                    this.paddle.move(-4, 0);
                    moved = true;
                    this.titleDiv.querySelectorAll("img")[0].style.border = "solid 3px yellow";
                } else if (value == this.right) { // Player moved right
                    this.paddle.move(4, 0);
                    moved = true;
                    this.titleDiv.querySelectorAll("img")[1].style.border = "solid 3px yellow";
                }
            }

            if (!moved)
                this.paddle.move(0, 0)

        }
    }

}

// Class represents a paddle instance in the game
class Paddle {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.x_speed = 0;
        this.y_speed = 0;
    }

    render() {
        context.fillStyle = "#0000FF";
        context.fillRect(this.x, this.y, this.width, this.height);
    };

    move(x, y) {
        this.x += x;
        this.y += y;
        this.x_speed = x;
        this.y_speed = y;
        if (this.x < 0) {
            this.x = 0;
            this.x_speed = 0;
        } else if (this.x + this.width > BOARD_WIDTH) {
            this.x = BOARD_WIDTH - this.width;
            this.x_speed = 0;
        }
    };

}

class Ball {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.x_speed = 0;
        this.y_speed = 1;
    }

    render() {
        context.beginPath();
        context.arc(this.x, this.y, BALL_RADIUS, 2 * Math.PI, false);
        context.fillStyle = "#F00000";
        context.fill();
    };

    update(paddle1, paddle2) {
        this.x += this.x_speed;
        this.y += this.y_speed;

        var top_x = this.x - 5;
        var top_y = this.y - 5;
        var bottom_x = this.x + 5;
        var bottom_y = this.y + 5;

        // Hit left side wall
        if (this.x - BALL_RADIUS < 0) {
            this.x = BALL_RADIUS;
            this.x_speed = -this.x_speed;
            wallAudio.play();
        } else if (this.x + BALL_RADIUS > BOARD_WIDTH) {
            this.x = BOARD_WIDTH - BALL_RADIUS;
            this.x_speed = -this.x_speed;
            wallAudio.play();
        }

        if (this.y < PADDLE_HEIGHT / 2) {
            this.x_speed = 0;
            this.y_speed = 1;
            this.x = BOARD_WIDTH / 2;
            this.y = BOARD_HEIGHT / 2;

            player1.playerScore++;
            if (player1.playerScore == WINNING_SCORE) {
                winnerPlayer = player1.playerType;
            }
        } else if (this.y > BOARD_HEIGHT - PADDLE_HEIGHT / 2) {
            this.x_speed = 0;
            this.y_speed = 1;
            this.x = BOARD_WIDTH / 2;
            this.y = BOARD_HEIGHT / 2;

            player2.playerScore++;
            if (player2.playerScore == WINNING_SCORE) {
                winnerPlayer = player2.playerType;
            }
        }

        if (top_y < (paddle1.y + paddle1.height) && bottom_y > paddle1.y && top_x < (paddle1.x + paddle1.width) && bottom_x > paddle1.x) {
            this.y_speed *= -1
            this.x_speed += (paddle1.x_speed / 2);
            this.y += this.y_speed;
            paddleAudio.play();
        }
        if (top_y < (paddle2.y + paddle2.height) && bottom_y > paddle2.y && top_x < (paddle2.x + paddle2.width) && bottom_x > paddle2.x) {
            this.y_speed *= -1;
            this.x_speed += (paddle2.x_speed / 2);
            this.y += this.y_speed;
            paddleAudio.play();
        }
    };
}

// Create players and ball for the game
var player1 = new Player(BOARD_HEIGHT - 2 * DIFF_PADDLE_BOARD, "player1", 39, 37, document.getElementById("playerTitle1"));
var player2 = new Player(DIFF_PADDLE_BOARD, "cpu", 83, 65, document.getElementById("playerTitle2"));
var ball    = new Ball(200, 300);


function gameType(playerType) {
    console.log(playerType);
    player2.playerType = playerType;
    document.getElementById("player2Name").innerHTML = player2.playerType;
}

function changeSound() {
    isAudioOn = !isAudioOn
    setSound(isAudioOn);

}
function setSound(on) {
    localStorage.setItem('muted', !on);
    document.getElementById("soundIcon").src = !on ? "images/soundOffIcon.png" : "images/soundOnIcon.png";
    paddleAudio.muted = !on;
    wallAudio.muted = !on;
}

function drawNet() {
    context.fillStyle = 'black';

    for (var i = 0; i < canvas.height; i += 40) {
        context.fillRect(i, canvas.height / 2 - 1, 36, 6);
    }
}

function drawScores() {
    context.font = "100px  sans-serif"
    context.fillStyle = "rgba(0, 0, 0, 0.5)";
    context.fillText(player1.playerScore, canvas.width / 2 - 27, canvas.height - 100);
    context.fillText(player2.playerScore, canvas.width / 2 - 27, 160);
}

var animate = function (callback) {
    timeoutID = window.setTimeout(callback, 1000 / FRAMES_PER_SEC)
}

var render = function () {
    context.fillStyle = "#FFFFFF";
    context.fillRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);
    player1.render();
    player2.render();
    drawNet();
    drawScores();
    ball.render();

};

var update = function () {
    player1.update(ball);
    player2.update(ball);
    ball.update(player1.paddle, player2.paddle);
};

var step = function () {
    if (isGamePaused) {
        context.fillStyle = 'white';
        context.fillRect(150, 280, 90, 40);
        context.fillStyle = 'black';
        context.font = "30px Jennie";
        context.fillText("paused", 155, 310)
    } else if (winnerPlayer != "") {
        context.fillStyle = 'grey';
        context.fillRect(110, 280, 170, 40);
        context.fillStyle = 'black';
        context.font = "30px Jennie";
        if (winnerPlayer == "cpu") {
            context.fillText("   " + winnerPlayer + " won!", 120, 310)
        } else {
            context.fillText(winnerPlayer + " won!", 120, 310)
        }
        context.font = "15px Jennie";
        context.fillText("<PRESS ANY KEY TO START AGAIN>", 80, 360);
    } else {
        update();
        render();
    }

    animate(step);
};

// Start the game
animate(step);

window.addEventListener("keydown", function (event) {
    var key = event.keyCode;

    if (winnerPlayer != "") {
        player1 = new Player(BOARD_HEIGHT - 2 * DIFF_PADDLE_BOARD, "player1", 39, 37, document.getElementById("playerTitle1"));
        player2 = new Player(DIFF_PADDLE_BOARD, player2.playerType, 83, 65, document.getElementById("playerTitle2"));
        ball = new Ball(BOARD_WIDTH / 2, BOARD_HEIGHT / 2);
        winnerPlayer = "";
    } else if (key === PAUSE_KEY)// Pause key   
    {
        isGamePaused = !isGamePaused;
    } else {
        keysDown[event.keyCode] = true;
    }
});

window.addEventListener("keyup", function (event) {
    delete keysDown[event.keyCode];
});

gameChoice1.addEventListener("keydown", function (eve) {
    eve.preventDefault();
});

gameChoice2.addEventListener("keydown", function (eve) {
    eve.preventDefault();
});