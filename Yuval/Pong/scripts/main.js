var canvas = document.getElementById("canvas");
const width = 400;
const height = 600;
const WINNING_SCORE = 3;
var player1Score = 0;
var player2Score = 0;
canvas.width = width;
canvas.height = height;
var context = canvas.getContext('2d');
var typeOfGame = "cpu";
var timeoutID;
var isGamePaused = false;
var hasWon = false;


var keysDown = {};

// class Computer {
//     constructor() {
//         this.paddle = new Paddle(175, 10, 50, 10);
//     }

//     render() {
//         this.paddle.render();
//     }

//     update(ball) {
//         if (typeOfGame == "cpu") {
//             var x_pos = ball.x;
//             var diff = -((this.paddle.x + (this.paddle.width / 2)) - x_pos);
//             if (diff < -4) {
//                 diff = -5;
//             } else if (diff > 4) {
//                 diff = 5;
//             }
//             this.paddle.move(diff, 0);
//             if (this.paddle.x < 0) {
//                 this.paddle.x = 0;
//             } else if (this.paddle.x + this.paddle.width > 400) {
//                 this.paddle.x = 400 - this.paddle.width;
//             }
//         }
//         else {
//             var moved = false;
//             for (var key in keysDown) {
//                 var value = Number(key);
//                 if (value == 65) {
//                     this.paddle.move(-4, 0);
//                     moved = true;
//                 } else if (value == 83) {

//                     this.paddle.move(4, 0);
//                     moved = true;
//                 }
//             }

//             if (!moved)
//                 this.paddle.move(0, 0)

//         }
//     }
// }

class Player {
    constructor(height, playerType, right, left) {
        //this.height=height;
        this.paddle = new Paddle(175, height, 50, 10);
        this.playerType = playerType;
        this.right = right;
        this.wrong = left;

    }

    render() {
        this.paddle.render();
    }

    update(ball) {
        if (this.playerType == "cpu") {
            var x_pos = ball.x;
            var diff = -((this.paddle.x + (this.paddle.width / 2)) - x_pos);
            if (diff < -4) {
                diff = -5;
            } else if (diff > 4) {
                diff = 5;
            }
            this.paddle.move(diff, 0);
            if (this.paddle.x < 0) {
                this.paddle.x = 0;
            } else if (this.paddle.x + this.paddle.width > 400) {
                this.paddle.x = 400 - this.paddle.width;
            }
        }
        else {
            var moved = false;
            for (var key in keysDown) {
                var value = Number(key);
                if (value == this.wrong) {
                    this.paddle.move(-4, 0);
                    moved = true;
                } else if (value == this.right) {

                    this.paddle.move(4, 0);
                    moved = true;
                }
            }

            if (!moved)
                this.paddle.move(0, 0)

        }
    }

}

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
        } else if (this.x + this.width > 400) {
            this.x = 400 - this.width;
            this.x_speed = 0;
        }
    };

}

// class Player {
//     constructor() {
//         this.paddle = new Paddle(175, 580, 50, 10);
//     }

//     render() {
//         this.paddle.render();
//     }

//     update() {
//         var moved = false;
//         for (var key in keysDown) {
//             var value = Number(key);
//             if (value == 37) {
//                 this.paddle.move(-4, 0);
//                 moved = true;
//             } else if (value == 39) {

//                 this.paddle.move(4, 0);
//                 moved = true;
//             }
//         }

//         if (!moved)
//             this.paddle.move(0, 0)
//     }
// }

class Ball {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.x_speed = 0;
        this.y_speed = 1;
    }

    render() {
        context.beginPath();
        context.arc(this.x, this.y, 5, 2 * Math.PI, false);
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

        if (this.x - 5 < 0) {
            this.x = 5;
            this.x_speed = -this.x_speed;
        } else if (this.x + 5 > 400) {
            this.x = 395;
            this.x_speed = -this.x_speed;
        }

        if (this.y < 0) {
            this.x_speed = 0;
            this.y_speed = 1;
            this.x = 200;
            this.y = 300;

            if (player2Score == WINNING_SCORE - 1) {

                player1Score = 0;
                player2Score = 0;
            } else {
                player2Score++;
            }
        } else if (this.y > 600) {
            this.x_speed = 0;
            this.y_speed = 1;
            this.x = 200;
            this.y = 300;

            if (player1Score == WINNING_SCORE - 1) {

                player1Score = 0;
                player2Score = 0;
            } else {
                player1Score++;
            }
        }

        if (top_y < (paddle1.y + paddle1.height) && bottom_y > paddle1.y && top_x < (paddle1.x + paddle1.width) && bottom_x > paddle1.x) {
            this.y_speed *= -1
            this.x_speed += (paddle1.x_speed / 2);
            this.y += this.y_speed;
        }
        if (top_y < (paddle2.y + paddle2.height) && bottom_y > paddle2.y && top_x < (paddle2.x + paddle2.width) && bottom_x > paddle2.x) {
            this.y_speed *= -1;
            this.x_speed += (paddle2.x_speed / 2);
            this.y += this.y_speed;
        }
    };
}

function gameType(playerType) {
    console.log(playerType);
    document.getElementById('gameChoice1').setAttribute("disabled", "disabled");
    document.getElementById('gameChoice2').setAttribute("disabled", "disabled");
    computer.playerType = playerType;
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
    context.fillText(player1Score, canvas.width / 2 - 27, 150);
    context.fillText(player2Score, canvas.width / 2 - 27, canvas.height - 100);
}

var player = new Player(580, "player1", 39, 37);


var computer = new Player(10, "cpu", 83, 65);
var ball = new Ball(200, 300);



var animate = function (callback) {
    timeoutID = window.setTimeout(callback, 1000 / 60)
}

var render = function () {
    context.fillStyle = "#FFFFFF";
    context.fillRect(0, 0, width, height);
    player.render();
    computer.render();
    drawNet();
    drawScores();
    ball.render();

};

var update = function () {
    player.update(ball);
    computer.update(ball);
    ball.update(player.paddle, computer.paddle);
};

var step = function () {
    // if (!isGamePaused) {
    //     update();
    //     render();
    // } else {
    //     context.fillStyle = 'white';
    //     context.fillRect(150, 280, 90, 40);
    //     context.fillStyle = 'black';
    //     context.font = "30px Jennie";
    //     context.fillText("paused", 155, 310)
    // }
    if(isGamePaused) {
        context.fillStyle = 'white';
        context.fillRect(150, 280, 90, 40);
        context.fillStyle = 'black';
        context.font = "30px Jennie";
        context.fillText("paused", 155, 310)
    } else if(hasWon){
        context.fillStyle = 'white';
        context.fillRect(150, 280, 90, 40);
        context.fillStyle = 'black';
        context.font = "30px Jennie";
        context.fillText("paused", 155, 310)
    } else {
        update();
        render();
    }
    animate(step);
};

animate(step);

window.addEventListener("keydown", function (event) {
    var key = event.keyCode;
    if (key === 32)// space key   
    {
        isGamePaused = !isGamePaused
    } else {
        keysDown[event.keyCode] = true;
    }
});

window.addEventListener("keyup", function (event) {
    delete keysDown[event.keyCode];
});
