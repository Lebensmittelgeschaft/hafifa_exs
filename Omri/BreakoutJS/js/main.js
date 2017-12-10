
// Constants Definition.
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const FRAMES_PER_SECOND = 60;
const GAME_PAUSED = 0;
const GAME_PLAYING = 1;
const GAME_OVER = 2;
const BRICKS_IN_ROW = 20;
const BRICKS_OFFSET_X = 20;
const BRICKS_OFFSET_Y = 30;
const BRICKS_BOARD_WIDTH = CANVAS_WIDTH - BRICKS_OFFSET_X;
const BRICKS_BOARD_HEIGHT = CANVAS_HEIGHT;
const BRICK_WIDTH = CANVAS_WIDTH / BRICKS_IN_ROW;
const BRICK_HEIGHT = CANVAS_HEIGHT / 50;
const PADDLE_WIDTH = CANVAS_WIDTH / 15;
const PADDLE_HEIGHT = CANVAS_HEIGHT / 60;
const PADDLE_START_X = (CANVAS_WIDTH - PADDLE_WIDTH) / 2;
const PADDLE_START_Y = CANVAS_HEIGHT * 9.5 / 10;
const PADDLE_COLOR = "#FFFFFF";
const PADDLE_SPEED = CANVAS_WIDTH / 160;
const CLEAR_SCREEN_COLOR = "#000000";
const BUFF_EFFECTS = [{effect: "speed", multiplier: 2, duration: [10, 20, 30]},
                      {effect: "width", multiplier: 2, duration: [10, 30, 40]},
                      {effect: "radius", multiplier: 3, duration: [10, 15, 20]},
                      {effect: "pierce", multiplier: 3, duration: [10, 15, 30]}];
const PADDLE_BUFFS = [BUFF_EFFECTS[0], BUFF_EFFECTS[1]];
const RELATIVE_PADDLE_BALL_BOUNCE = 1;
const BALL_BUFFS = [BUFF_EFFECTS[0], BUFF_EFFECTS[2], BUFF_EFFECTS[3]];
const BALL_RADIUS = BRICK_HEIGHT / 2;
const BALL_START_X = (CANVAS_WIDTH - BALL_RADIUS) / 2;
const BALL_START_Y = (CANVAS_HEIGHT - BALL_RADIUS) / 2;
const BALL_COLOR = PADDLE_COLOR;
const BALL_SPEED = {x: 2, y: -4};
const PADDLE_DIR_LEFT = -1;
const PADDLE_DIR_RIGHT = 1;

const LEVEL1 = {name: "Rainbow Road", pattern:[{length: 2, space: 0, basecolor: [255, 0, 0], colorshift: [0, 255, 0], hasbuff: false},
                {length: 3, space: 1, basecolor: [255, 127, 0], colorshift: [255, 127, 0], hasbuff: true},
                {length: 2, space: 0, basecolor: [255, 255, 0], colorshift: [255, 255, 0], hasbuff: true},
                {length: 1, space: 0, basecolor: [0, 255, 0], colorshift: [0, 255, 0], hasbuff: false},
                {length: 4, space: 1, basecolor: [0, 0, 255], colorshift: [0, 0, 255], hasbuff: false},
                {length: 6, space: 0, basecolor: [75, 0, 130], colorshift: [75, 0, 130], hasbuff: false},
                {length: 4, space: 1, basecolor: [148, 0, 211], colorshift: [148, 0, 211], hasbuff: false}]};
const LEVELS = [LEVEL1];

// Globals Definition
var paddle;
var ball;

class Circle {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }

    draw(ctx) {
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        //ctx.stroke();
    }
}

class Ball extends Circle {
    constructor(x, y, radius, color, speed) {
        super(x, y, radius, color);
        this.speed = speed;
    }

    update(paddle, board) {
        let targetHit = null;

        // Paddle hit detection.
        if (this.y + this.radius >= paddle.y && this.y + this.radius <= paddle.y + paddle.height) {
            if (this.x + this.radius >= paddle.x && this.x + this.radius <= paddle.x + paddle.width) {
                this.speed.y = -this.speed.y;
                targetHit = paddle;
                let relLocationHit = (this.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2);
                this.speed.x += relLocationHit * RELATIVE_PADDLE_BALL_BOUNCE;
            }
        }
        
        // Wall hit detection.
        if (this.y <= 0) {
            this.speed.y = -this.speed.y;
        }

        if (this.x - this.radius <= 0 || this.x + this.radius >= CANVAS_WIDTH) {
            this.speed.x = -this.speed.x;
        }

        // Bricks hit detection.
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j]) {
                    if (this.y >= board[i][j].y && this.y <= board[i][j].y + board[i][j].height) { // Hit the brick.
                        if (this.x >= board[i][j].x && this.x <= board[i][j].x + board[i][j].width) {
                            if ((this.y - this.speed.y <= board[i][j].y) ||
                                (this.y - this.speed.y >= board[i][j].y + board[i][j].height)) { // Hit from the top or the bottom of the brick.
                                this.speed.y = -this.speed.y;
                            }

                            if ((this.x - this.speed.x <= board[i][j].x) ||
                                (this.x - this.speed.x >= board[i][j].x + board[i][j].width)) { // Hit from the left or the right of the brick.
                                    this.speed.x = -this.speed.x;
                            }

                            targetHit = board[i][j];
                            board[i][j] = null;
                        }
                    }
                }
            }
        }

        // Update the ball's location with its speed and direction.
        this.x += this.speed.x;
        this.y += this.speed.y;

        return targetHit;
    }
}

// Class that represents a buff for an object in the game (i.e multiplying the paddle's movement speed by 2.).
class Buff {
    constructor(target, effect) {
        this.target = target;
        this.effect = effect;
    }

    Apply() {
        if (this.target instanceof Paddle) {
            
        } else if (this.target instanceof Ball) {

        }
    }

    static RandomizeBuff() {
        switch (Math.floor(Math.random() * 2)) {
            case 0: { // Paddle buff.
                return new Buff(paddle, PADDLE_BUFFS[Math.floor(Math.random() * PADDLE_BUFFS.length)]);
            }

            case 1: { // Ball buff.
                return new Buff(ball, BALL_BUFFS[Math.floor(Math.random() * BALL_BUFFS.length)]);
            }
        }
    }
}

class Rectangle {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Paddle extends Rectangle {
    constructor(x, y, width, height, color, speed) {
        super(x, y, width, height, color);
        this.speed = speed;
        this.dir = 0;
    }

    move() {
        if (this.x + this.dir * this.speed >= 0 && this.x + this.dir * this.speed + this.width <= CANVAS_WIDTH) {
            this.x += this.dir * this.speed;
        }
    }
}


class Brick extends Rectangle {
    constructor(x, y, width, height, color, buff) {
        super(x, y, width, height, color);
        this.buff = buff;
    }
}

class Level {
    constructor(level, width, height) {
        this.width = width;
        this.height = height;
        this.board = [];
        this.name = level.name;
        let pattern = level.pattern;

        // Init the board of the bricks from the given level pattern.
        var that = this;
        for (let i = 0; i < pattern.length; i++) {
            that.board[i] = new Array(that.width / BRICK_WIDTH << 0);
            for(let k = 0; k < that.board[i].length; k++) {
                that.board[i][k] = null;
            }

            let currBrick = 0;
            let totalBricks = that.board[i].length / (pattern[i].length + pattern[i].space) * pattern[i].length ** 2 / (pattern[i].length + pattern[i].space) + that.board[i].length % (pattern[i].length) - 1;
            let buffIndex = pattern[i].hasbuff ? Math.floor(Math.random() * (that.board[i].length - pattern[i].space) / pattern[i].length) : -1;
            for (let k = pattern[i].space; k < that.board[i].length; k += pattern[i].length + pattern[i].space) {
                let buff = k == buffIndex ? Buff.RandomizeBuff() : null;
                for (let z = k; (z < pattern[i].length + k) && (z < that.board[i].length) ; z++) {
                    let color = '';
                    color += 'rgb(' + ((pattern[i].basecolor[0] + (pattern[i].colorshift[0] - pattern[i].basecolor[0]) * currBrick / totalBricks) << 0) + ',' +
                                        ((pattern[i].basecolor[1] + (pattern[i].colorshift[1] - pattern[i].basecolor[1]) * currBrick / totalBricks) << 0) + ',' +
                                        ((pattern[i].basecolor[2] + (pattern[i].colorshift[2] - pattern[i].basecolor[2]) * currBrick / totalBricks) << 0) + ')';
                    that.board[i][z] = new Brick(BRICKS_OFFSET_X + z * BRICK_WIDTH,
                                                    BRICKS_OFFSET_Y + i * BRICK_HEIGHT,
                                                    BRICK_WIDTH, BRICK_HEIGHT,
                                                    color,
                                                    buff);
                    currBrick++;
                }
            } 
        }
    }
}

class Game {
    constructor(displayWidth, displayHeight, ctx, levels) {
        this.displayWidth = displayWidth;
        this.displayHeight = displayHeight;
        this.ctx = ctx;
        this.levels = levels;
        this.setLevel(0);
        this.state = GAME_PAUSED;
        paddle.dir = 0;
        document.onkeydown = this.keyPresses;
        document.onkeyup = this.keyReleases;
        ctx.canvas.width = CANVAS_WIDTH;
        ctx.canvas.height = CANVAS_HEIGHT;
    }

    getLevel() {
        return this.currLevel;
    }

    setLevel (level) {
        if (level >= 0 && level <= this.levels.length) {
            this.currLevel = this.levels[level];
            document.getElementById('lvlname').innerHTML = this.levels[level].name;
        }
    }

    init() {
        this.state = GAME_PLAYING;
        setInterval(() => {this.gameLoop();}, 1000 / FRAMES_PER_SECOND);
    }

    gameLoop() {
        this.draw();
        if (this.state == GAME_PLAYING) {
            this.update();
        }
    }

    keyPresses(e) {
        e = e || window.event;
        switch (e.keyCode) {
            case 37: { // Left arrow.
                paddle.dir = PADDLE_DIR_LEFT;

                break;
            }

            case 39: { // Right arrow.
                paddle.dir = PADDLE_DIR_RIGHT;

                break;
            }

            case 27 : { // Escape key.
                this.state != this.state;

                break;
            }
        }
    }
    
    keyReleases(e) {
        e = e || window.event;
        switch (e.keyCode) {
            case 37:
            case 39: {
                paddle.dir = 0;

                break;
            }
        }
    }

    clearScreen() {
        this.ctx.fillStyle = CLEAR_SCREEN_COLOR;
        this.ctx.fillRect(0, 0, this.displayWidth, this.displayHeight);
    }

    draw() {
        this.clearScreen();
        this.ctx.beginPath();
        ball.draw(this.ctx);
        paddle.draw(this.ctx);
        for (let i = 0; i < this.currLevel.board.length; i++) {
            for (let j = 0; j < this.currLevel.board[i].length; j++) {
                if (this.currLevel.board[i][j]) {
                    this.currLevel.board[i][j].draw(this.ctx);
                }
            }
        }
        this.ctx.closePath();
    }

    update() {
        if (paddle.dir) {
            paddle.move();
        }

        let targetHit = ball.update(paddle, this.currLevel.board);
        if (targetHit) {
            if (targetHit instanceof Brick) {
                // Play sfx.
            } else if (targetHit instanceof Paddle) {
                // Play sfx.
            }
        }
    }
}

function startGame() {
    let levels = [];
    for (let i = 0; i < LEVELS.length; i++) {
        levels.push(new Level(LEVELS[0], BRICKS_BOARD_WIDTH, BRICKS_BOARD_HEIGHT));
    }
    
    paddle = new Paddle(PADDLE_START_X, PADDLE_START_Y, PADDLE_WIDTH, PADDLE_HEIGHT, PADDLE_COLOR, PADDLE_SPEED);
    ball = new Ball(BALL_START_X, BALL_START_Y, BALL_RADIUS, BALL_COLOR, BALL_SPEED);
    let game = new Game(CANVAS_WIDTH, CANVAS_HEIGHT, document.getElementById('canvas').getContext('2d'), levels);
    game.init();
}