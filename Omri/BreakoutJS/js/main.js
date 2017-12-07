const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const BRICKS_OFFSET_X = 20;
const BRICKS_OFFSET_Y = 20;
const BRICKS_BOARD_WIDTH = CANVAS_WIDTH - BRICKS_OFFSET_X;
const BRICKS_BOARD_HEIGHT = CANVAS_HEIGHT;
const BRICK_WIDTH = CANVAS_WIDTH / 40;
const BRICK_HEIGHT = CANVAS_HEIGHT / 60;
const CLEAR_SCREEN_COLOR = "#000";
const MAX_LEVEL = 1;
const LEVEL1 = [{length: 2, space: 0, basecolor: 0x000000, colorshift: 0xFFFFFF, hasbuff: false},
                {length: 2, space: 1, basecolor: 0xFFFFFF, colorshift: 0x000000, hasbuff: true},
                {length: 2, space: 2, basecolor: 0x123456, colorshift: 0xC0FFEE, hasbuff: true}];


// Class that represents a buff for an object in the game (i.e multiplying the paddle's movement speed by 2.).
class Buff {
    constructor(name, duration, target, effect, value) {
        this.name = name;
        this.duration = duration;
        this.target = target;
        this.effect = effect;
        this.value = value;
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


class Brick extends Rectangle {
    constructor(x, y, width, height, color, buff) {
        super(x, y, width, heigh, color);
        this.buff = buff;
    }
}

class Level {
    constructor(pattern, width, height) {
        this.width = width;
        this.height = height;
        this.board = [];

        // Init the board of the bricks from the given level pattern.
        for (let i = 0; i < pattern.length; i++) {
            for (let j = 0; j < this.width; j++) {
                this.board[i] = new Array(width);
                for(let k = 0; k < this.board[i].length; k++) {
                    this.board[i][k] = null;
                }

                let buffIndex = pattern[i].hasbuff ? parseInt(Math.random() * (this.board[i].length - pattern[i].space) / pattern[i].length) : -1;
                for (let k = space; k <= (this.board[i].length - pattern[i].space) / pattern[i].length; k += pattern[i].length + space ) {
                    for (let z = 0; z < pattern[i].length; z++) {
                        
                        this.board[i][k] = new Brick(BRICKS_OFFSET_X + k * BRICK_WIDTH,
                                                     BRICKS_OFFSET_Y + k * BRICK_HEIGHT,
                                                     BRICK_WIDTH, BRICK_HEIGHT,
                                                     pattern[i].basecolor + (pattern[i].colorshift - pattern[i].basecolor) / k);
                    }
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
        this.currLevel = this.levels[0];
    }

    getLevel() {
        return this.currLevel;
    }

    setLevel (level) {
        if (level <= MAX_LEVEL) {
            this.currLevel = level;
        }
    }

    init() {
    }

    clearScreen() {
        this.fillStyle = CLEAR_SCREEN_COLOR;
        this.ctx.fillRect(0, 0, this.displayWidth, this.displayHeight);
    }
}