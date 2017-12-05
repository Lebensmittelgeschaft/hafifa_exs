/* This module represent game engine for 'Space Invaders'
 * @author Shaked Manes */

// This variable contains the configuration options for the game
let CONFIG = {
    "GAME_HEIHGT" : 600,
    "GAME_WIDTH" : 600,
    "GAME_BACKGROUND_COLOR": "black",
    "SPACESHIP_COLOR" : "green",
    "SPACESHIP_HEIGHT" : 40,
    "SPACESHIP_WIDTH" : 50,
    "ALIENSHIP_COLOR" : "red",
    "ALIENSHIP_HEIGHT" : 30,
    "ALIENSHIP_WIDTH" : 30,
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

    constructor(color, width, height, location) {        
        this.color = color;        
        this.width = width;
        this.height = height;
        this.location = location;
    }        
}

/* Represent the spaceship of the player */
class SpaceShip extends Ship {
    
    constructor(color, width, height, location, health) {
        super(color, width, height, location);
        this.health = health;
    }    
}

/* Represent alienship (enemy in the game) */
class AlienShip extends Ship {

    constructor(color, width, height, location) {
        super(color, width, height, location);
    }
}

/* Represent the actual game engine for all the functionality of the game */
class Game {
    
    static menu() {

    }

    static initializeBoard() {

    }

    static playTurn() {

    }

    static gameLoop() {

    }
}

