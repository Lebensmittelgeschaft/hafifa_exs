/* This module represent game engine for 'Space Invaders'
 * @author Shaked Manes */

// This variable contains the configuration options for the game
let CONFIG = {
    "GAME_HEIGHT": 600,
    "GAME_WIDTH": 600,
    "GAME_FPS": 30,
    "GAME_BACKGROUND_COLOR": "black",
    "GAME_TITLE_FONT": "30px Arial",
    "GAME_TEXT_FONT": "16px Arial",
    "GAME_FONT_COLOR": "white",
    "GAME_FONT_POSITION": "center",
    "GAME_NAME": "Space Invaders",
    "SPACESHIP_IMAGE": "./images/spaceship.png",
    "SPACESHIP_HEIGHT": 40,
    "SPACESHIP_WIDTH": 50,
    "SPACESHIP_SPEED": 20,
    get PLAYER_START_POS_X() { return this.GAME_WIDTH / 2 },
    get PLAYER_START_POS_Y() { return this.GAME_HEIGHT - (this.GAME_HEIGHT / 6) },
    "ALIENSHIP_IMAGE": "./images/alienship.png",
    "ALIENSHIP_HEIGHT": 30,
    "ALIENSHIP_WIDTH": 30,
    "ALIENS_COUNT": 20,
    "ALIENS_ROW": 5,
    "ALIENS_MOVEMENT": {
        'X': 20,
        'Y': -20
    },
    get ALIEN_START_POS_X() { return this.GAME_WIDTH / 6 },
    get ALIEN_START_POS_Y() { return this.GAME_HEIGHT / 10 },
    "KEY_ENTER": 13,
    "KEY_SPACE": 32,
    "KEY_LEFT": 37,
    "KEY_UP": 38,
    "KEY_RIGHT": 39,
    "KEY_DOWN": 40,
    "RIGHT_DIR": 1,
    "LEFT_DIR": -1
}

let GAME_STATUS = {
    "MENU": 0,
    "START": 1,
    "PLAY": 2,
    "END": 3
}

let DIR_VEC = {
    "LEFT": -20,
    "RIGHT": 20,
};

/* Represent Point in the game space */
class Point {

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

/* Represent ship in the game */
class Ship {

    constructor(image, width, height, location) {
        this.image = image;
        this.width = width;
        this.height = height;
        this.location = location;
    }

    draw(canvas_context) {
        canvas_context.drawImage(this.image, this.location.x,
            this.location.y, this.width,
            this.height);
    }
}

/* Represent the spaceship of the player */
class SpaceShip extends Ship {

    constructor(image, width, height, location, health, speed) {
        super(image, width, height, location);
        this.health = health;
        this.speed = CONFIG.SPACESHIP_SPEED;
        this.direction = 1;
    }

    update() {
        this.location.x += this.speed * this.direction;
    }
}

/* Represent alienship (enemy in the game) */
class AlienShip extends Ship {

    constructor(image, width, height, location, moveX, moveY) {
        super(image, width, height, location, moveX, moveY);
        this.alive = true;
    }



}

class Game {

    constructor() {
        this.game_canvas = document.getElementById("game-canvas");
        this.game_canvas.width = CONFIG.GAME_WIDTH;
        this.game_canvas.height = CONFIG.GAME_HEIGHT;
        this.game_canvas.style.backgroundColor = CONFIG.GAME_BACKGROUND_COLOR;
        this.game_context = this.game_canvas.getContext('2d');

        this.status = GAME_STATUS.MENU;
        this.aliens = new Array(CONFIG.ALIENS_COUNT);
        this.tick_count = 0;
        this.player = undefined;        
        this.aliens_movement = {
            "x": CONFIG.ALIENS_MOVEMENT.X,
            "y": CONFIG.ALIENS_MOVEMENT.Y
        }
        this.gameLoopInterval = undefined;        
        window.addEventListener("keydown", (event) => {
            let key_pressed = event.keyCode;

            switch (key_pressed) {
                case (CONFIG.KEY_SPACE):
                    // Perform shooting

                    break;
                case (CONFIG.KEY_RIGHT):
                    this.player.direction = CONFIG.RIGHT_DIR;
                    this.player.update();
                    break;
                case (CONFIG.KEY_LEFT):
                    this.player.direction = CONFIG.LEFT_DIR;
                    this.player.update();
                    break;

                case (CONFIG.KEY_ENTER):
                    if (this.status == GAME_STATUS.MENU) {
                        this.status = GAME_STATUS.PLAY;
                        this.tick_count = 0;
                        this.gameStart();
                        this.gameLoopInterval = setInterval(() => {this.gameLoop();}, 1000/CONFIG.GAME_FPS);
                    }
                    break;

                default:
                    break;
            }
        });
    }

    cleanBoard() {
        this.game_context.clearRect(0, 0, CONFIG.GAME_WIDTH, CONFIG.GAME_HEIGHT);
    }

    /**
     * Start the game functionality and the game loop
     */
    gameStart() {
        this.initializeBoard();        
    }

    /*
     * Sets the game status to MENU and shows the menu of the game
     */
    menu() {
        this.status = GAME_STATUS.MENU;
        this.cleanBoard();

        this.game_context.font = CONFIG.GAME_TITLE_FONT;
        this.game_context.fillStyle = CONFIG.GAME_FONT_COLOR;
        this.game_context.textBaseline = CONFIG.GAME_FONT_POSITION;
        this.game_context.textAlign = CONFIG.GAME_FONT_POSITION;
        this.game_context.fillText(CONFIG.GAME_NAME, CONFIG.GAME_WIDTH / 2, CONFIG.GAME_HEIGHT / 2 - 40);
        this.game_context.font = CONFIG.GAME_TEXT_FONT;
        this.game_context.fillText("Press 'Enter' to start.", CONFIG.GAME_WIDTH / 2, CONFIG.GAME_HEIGHT / 2);
    }

    /**
     * Initialize the game board for first play
     */
    initializeBoard() {
        this.cleanBoard();
        this.initializeObjects();
    }

    /**
     * Initialize all the objects of the game for the first play
     */
    initializeObjects() {

        let alien_current_location = new Point(CONFIG.ALIEN_START_POS_X, CONFIG.ALIEN_START_POS_Y);
        let player_start_location = new Point(CONFIG.PLAYER_START_POS_X, CONFIG.PLAYER_START_POS_Y);

        let player_image = new Image();
        player_image.src = CONFIG.SPACESHIP_IMAGE;
        player_image.onload = () => {
            this.player = new SpaceShip(player_image, CONFIG.SPACESHIP_WIDTH, CONFIG.SPACESHIP_HEIGHT, player_start_location);
            this.player.draw(this.game_context);
        };

        let alien_image = new Image();
        alien_image.src = CONFIG.ALIENSHIP_IMAGE;
        alien_image.onload = () => {
            for (let index = 0; index < this.aliens.length; index++) {
                let current_location = new Point(alien_current_location.x, alien_current_location.y);
                this.aliens[index] = new AlienShip(alien_image, CONFIG.ALIENSHIP_WIDTH, CONFIG.ALIENSHIP_HEIGHT, current_location);
                this.aliens[index].draw(this.game_context);
                if ((index + 1) % CONFIG.ALIENS_ROW == 0) {                    
                    alien_current_location.x = CONFIG.ALIEN_START_POS_X;
                    alien_current_location.y += CONFIG.ALIENSHIP_HEIGHT + 20;
                } else {
                    alien_current_location.x += CONFIG.ALIENSHIP_WIDTH + 20;
                }
            }            
        };
    }

    updateGame() {

        // Check for all collisions and delete the collision   

        // Draw all aliens
        
        for (let index = 0; index < this.aliens.length; index++) {
            if (this.aliens[index].alive) {
                this.aliens[index].draw(this.game_context);
                //console.log(this.aliens[index].location);
            }
        }

        // Draw player
        this.player.draw(this.game_context);
    }

    updateAliens() {

        // Check last alien side
        let index = this.aliens.length - 1;
        if (this.aliens_movement.x < 0) { // Movement left direction
            index = 0;
        }       
        
        let alien_location = new Point(this.aliens[index].location.x, this.aliens[index].location.y);        
        alien_location.x += this.aliens_movement.x;
        if (!Game.isValidLocation(alien_location)) {
            this.aliens_movement.x *= -1;
            for (let index = 0; index < this.aliens.length; index++) {
                this.aliens[index].location.y += this.aliens_movement.y;
            }
        } else {
            for (let index = 0; index < this.aliens.length; index++) {
                this.aliens[index].location.x += this.aliens_movement.x;
            }
        }
    }

    gameLoop() {

        // Stops the game loop interval
        if (this.status == GAME_STATUS.END) {
            clearInterval(this.gameLoopInterval);
            // Show end game
        }

        // Update movement tick count for the aliens
        this.tick_count++;        
        // Update aliens positions if they need to move
        if (this.tick_count % 10 == 0) {
            this.updateAliens();
        }

        this.cleanBoard();

        this.updateGame();

        if (this.status == GAME_STATUS.PLAY) {
            // requestAnimationFrame(() => {
            //     this.gameLoop();
            // });
        }

    }

    static isValidLocation(location) {
        return ((location.x <= CONFIG.GAME_WIDTH ||
            location.x >= CONFIG.GAME_WIDTH) &&
            (location.y <= CONFIG.GAME_HEIGHT ||
                location.y >= CONFIG > GAME_HEIGHT));
    }
}

window.onload = function () {
    let game = new Game();
    game.menu();
}
