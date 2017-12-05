/* This module represent game engine for 'Space Invaders'
 * @author Shaked Manes */

// This variable contains the configuration options for the game
let CONFIG = {
    "GAME_HEIGHT" : 600,
    "GAME_WIDTH" : 600,
    "GAME_BACKGROUND_COLOR": "white",
    "GAME_TITLE_FONT" : "30px Arial",
    "GAME_TEXT_FONT" : "16px Arial",
    "GAME_FONT_COLOR" : "black",
    "GAME_FONT_POSITION" : "center",
    "GAME_NAME" : "Space Invaders",    
    "SPACESHIP_IMAGE" : "./images/spaceship.png",
    "SPACESHIP_HEIGHT" : 40,
    "SPACESHIP_WIDTH" : 50,
    get PLAYER_START_POS_X() {return this.GAME_WIDTH / 2 },
    get PLAYER_START_POS_Y() {return this.GAME_HEIGHT  - (this.GAME_HEIGHT / 6 )},
    "ALIENSHIP_IMAGE" : "./images/alienship.png",
    "ALIENSHIP_HEIGHT" : 30,
    "ALIENSHIP_WIDTH" : 30,
    "ALIENS_COUNT" : 20,
    "ALIENS_ROW" : 5,
    get ALIEN_START_POS_X() {return this.GAME_WIDTH / 6 },    
    get ALIEN_START_POS_Y() {return this.GAME_HEIGHT / 6 },
    "KEY_ENTER" : 13,
    "KEY_SPACE" : 32,
    "KEY_LEFT" : 37,
    "KEY_UP" : 38,
    "KEY_RIGHT" : 39,
    "KEY_DOWN" : 40    
}

let GAME_STATUS = {
    "MENU": 0,
    "START": 1,
    "PLAY": 2,
    "END": 3
}

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
}

/* Represent the spaceship of the player */
class SpaceShip extends Ship {
    
    constructor(image, width, height, location, health) {
        super(image, width, height, location);
        this.health = health;
    }    
}

/* Represent alienship (enemy in the game) */
class AlienShip extends Ship {
    
    constructor(image, width, height, location) {
        super(image, width, height, location);
    }
}

/* Represent the actual game engine for all the functionality of the game */
class Game {
    
    /**
     * Construct game instance which handles the game logic flow
     * @param {*} drawer - drawer object that handles drawing the canvas context
     */
    constructor(drawer) {
        this.drawer = drawer;
        this.status = GAME_STATUS.MENU;
        this.aliens = new Array(CONFIG.ALIENS_COUNT);
        this.player = undefined;        
        window.addEventListener("keydown", event => this.handleKeyDown(event));
        window.addEventListener("keyup", event => this.handleKeyUp(event));
    }

    /**
     * Start the game functionality and the game loop
     */
    gameStart() {
        this.initializeBoard();
        this.gameLoop();

    }

    /*
     * Sets the game status to MENU and shows the menu of the game
     */
    menu() {
        this.status = GAME_STATUS.MENU;
        this.drawer.cleanBoard();
        this.drawer.drawMenu();
    }

    /**
     * Initialize the game board for first play
     */
    initializeBoard() {
        this.drawer.cleanBoard();
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
            this.drawer.drawShip(this.player);
        };             
        
        let alien_image = new Image();
        alien_image.src = CONFIG.ALIENSHIP_IMAGE;
        alien_image.onload = () => {
            for (let index = 0; index < this.aliens.length; index++) {            
                this.aliens[index] = new AlienShip(alien_image, CONFIG.ALIENSHIP_WIDTH, CONFIG.ALIENSHIP_HEIGHT, alien_current_location);
                this.drawer.drawShip(this.aliens[index]);
                if ((index + 1) % CONFIG.ALIENS_ROW == 0) {
                    alien_current_location.x = CONFIG.ALIEN_START_POX_X;
                    alien_current_location.y += CONFIG.ALIENSHIP_HEIGHT;
                } else {
                    alien_current_location.x += CONFIG.ALIENSHIP_WIDTH + 20;
                }
            }
        };        
    }

    playTurn() {

    }

    gameLoop() {

    }

    handleKeyDown(event) {
        let keyCode = event.which || window.event.keycode;
        
        switch (keyCode) {
            case CONFIG.KEY_LEFT:

                break;
            case CONFIG.KEY_RIGHT:
                
                break;
            
            case CONFIG.KEY_UP:

                break;
            
            case CONFIG.KEY_DOWN:

                break;
            
            default:
                break;
        }
    }

    handleKeyUp(event) {
        let keyCode = event.which || window.event.keycode;
        if (keyCode == CONFIG.KEY_ENTER && this.status == GAME_STATUS.MENU) {
            this.gameStart();
        }
    }
}

window.onload = function () {
    let drawer = new Drawer();
    let game = new Game(drawer);
    game.menu();
}
