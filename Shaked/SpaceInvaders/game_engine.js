/* This module represent game engine for 'Space Invaders'
 * @author Shaked Manes */

// This variable contains the configuration options for the game
const CONFIG = {
    "GAME_HEIGHT": 600,
    "GAME_WIDTH": 600,
    "GAME_FPS": 30,
    "GAME_BACKGROUND_COLOR": "black",
    "GAME_TITLE_FONT": "30px Arial",
    "GAME_TEXT_FONT": "16px Arial",
    "GAME_FONT_COLOR": "white",
    "WIN_FONT_COLOR": "gold",
    "LOSE_FONT_COLOR": "red",
    "GAME_TEXT_MENU": "Space Invaders",
    "GAME_SUBTEXT_MENU": "Press 'Enter' to start.",
    "GAME_TEXT_PAUSE": "Game Paused",
    "GAME_SUBTEXT_PAUSE": "Press 'Enter' to unpause.",
    "GAME_TEXT_END": "Game Ended",
    "GAME_SUBTEXT_END": "Press 'Enter' to restart.",
    "GAME_TEXT_WIN": "YOU WIN!",
    "GAME_TEXT_LOSE": "YOU LOSE :(",    
    "GAME_FONT_POSITION": "center",
    "GAME_NAME": "Space Invaders",
    "SPACESHIP_IMAGE": "./images/spaceship.png",
    "SPACESHIP_HEIGHT": 40,
    "SPACESHIP_WIDTH": 50,
    "SPACESHIP_SPEED": 10,
    "SPACESHIP_HEALTH": 3,
    "BULLET_HEIGHT": 10,
    "BULLET_WIDTH": 5,
    "BULLET_MOVEMENT": 20,
    get PLAYER_START_POS_X() { return this.GAME_WIDTH / 2 },
    get PLAYER_START_POS_Y() { return this.GAME_HEIGHT - (this.GAME_HEIGHT / 6) },
    "ALIENSHIP_IMAGE": "./images/alienship.png",
    "ALIENSHIP_HEIGHT": 30,
    "ALIENSHIP_WIDTH": 30,
    "ALIENS_COUNT": 20,
    "ALIENS_ROW": 5,
    "ALIENS_MOVEMENT": {
        'X': 20,
        'Y': 20
    },
    "ALIENS_SPEED": 40,
    "ALIENS_SPEED_REDUCE": 4,
    "ALIENS_KILL_SCORE": 50,
    "ALIENS_MAX_BULLETS": 5,
    "ALIENS_SHOOT_FREQ": 5,
    "ALIENS_SHOOT_FREQ_RANGE": 10,
    "ALIENS_FREEZE_TIME": 5000,
    get ALIEN_START_POS_X() { return this.GAME_WIDTH / 6 },
    get ALIEN_START_POS_Y() { return this.GAME_HEIGHT / 10 },
    "GIFT_WIDTH": 30,
    "GIFT_HEIGHT": 30,
    "GIFT_MOVEMENT": 5,
    "GIFT_IMAGE": "./images/gift.png",
    "GIFT_FREQ": 10,
    "GIFT_FREQ_RANGE": 50,    
    "KEY_ENTER": 13,
    "KEY_ESC": 27,
    "KEY_SPACE": 32,
    "KEY_LEFT": 37,
    "KEY_UP": 38,
    "KEY_RIGHT": 39,
    "KEY_DOWN": 40,
    "RIGHT_DIR": 1,
    "LEFT_DIR": -1
}

/* Represent status in the game */
const GAME_STATUS = {
    "MENU": 0,
    "PLAY": 1,
    "PAUSE": 2,
    "WIN": 3,
    "LOSE": 4
}

/* Represent gift types in the game */
const GIFT_LIST = {
    "REGAIN_LIVE": 0,
    "ALIENS_ALIVE": 1,
    "ALIENS_FREEZE": 2,
    "ADD_BULLET": 3
}

const GIFT_INFO = ["Regain Live!", "Aliens Alive!", "Aliens Freeze!", "Add Bullet To Player!"];

/* Represent Location in the game space */
class Location {

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

/* Represent element in the game */
class Ship {

    constructor(image, width, height, location) {
        this.image = image;
        this.width = width;
        this.height = height;
        this.location = location;
    }
    /**
     * Draws the ship element on the canvas
     * @param {*} canvas_context - canvas context to draw on
     */
    draw(canvas_context) {
        canvas_context.drawImage(this.image, this.location.x, this.location.y,
            this.width, this.height);
    }
}

/* Represent the spaceship of the player */
class SpaceShip extends Ship {

    constructor(image, width, height, location, health, speed) {
        super(image, width, height, location);
        this.health = health;
        this.speed = speed;
        this.direction = CONFIG.RIGHT_DIR;
        this.bullets = [];
        this.bullets_max_size = 1;
    }

    // Updates the spaceship location
    update() {
        let test_location = new Location(this.location.x + this.speed * this.direction, this.location.y);

        // The spaceship width is bigger in the right side so it need to be considered
        if (this.direction == CONFIG.RIGHT_DIR) {
            test_location.x += this.width / 2;
        }

        if (Game.isValidLocation(test_location)) {
            this.location.x += this.speed * this.direction;
        }
    }

    // Updates the spaceship's bullets location
    updateBullets() {
        for (let index = 0; index < this.bullets.length; index++) {
            if (this.bullets[index].location.y < 0) {
                this.bullets.splice(index, 1);
            } else {
                this.bullets[index].update(- CONFIG.BULLET_MOVEMENT);
            }
        }
    }

    // Add new bullet in the spaceships bullets array
    shoot() {
        if (this.bullets.length != this.bullets_max_size) {
            this.bullets.push(new Bullet(CONFIG.BULLET_WIDTH, CONFIG.BULLET_HEIGHT, new Location(this.location.x + this.width / 2, this.location.y)));
        }
    }

    // Reduce health by getting damage
    damage() {
        if (this.health > 0) {
            this.health -= 1;
        }
    }
}

/* Represent alienship (enemy in the game) */
class AlienShip extends Ship {

    constructor(image, width, height, location, moveX, moveY) {
        super(image, width, height, location, moveX, moveY);
        this.alive = true;
    }
}

/* Represent falling element in the game */
class FallenElement {
    
    constructor(width, height, location) {
        this.width = width;
        this.height = height;
        this.location = location;
    }

    /**
     * Update the location of the element
     * @param {*} movement_y - movement to add for the y-aixs location 
     */
    update(movement_y) {
        this.location.y += movement_y;
    }

    /**
     * Checking if the element collides with an element
     * @param {*} element - element to check for colliding with the bullet
     */
    collide(element) {
        return ((this.location.x <= element.location.x + element.width &&
                 this.location.x >= element.location.x) &&
                (this.location.y <= element.location.y + element.height &&
                 this.location.y >= element.location.y));
    }
}

/* Represent bullet in the game */
class Bullet extends FallenElement {
    
    constructor(width, height, location) {
        super(width, height, location);        
    }

    /**
     * Draw the bullet on the canvas
     * @param {*} canvas_context - canvas context to draw on 
     */
    draw(canvas_context) {
        canvas_context.fillRect(this.location.x, this.location.y, this.width, this.height);
    }    
}

class Gift extends FallenElement {
    constructor(image, width, height, location) {
        super(width, height, location);
        this.image = image;        
    }

    /**
     * Draw the gift on the canvas
     * @param {*} canvas_context - canvas context to draw on 
     */
    draw(canvas_context) {
        if (this.image.complete) {
            canvas_context.drawImage(this.image, this.location.x, this.location.y,
                this.width, this.height);
        } else {
            this.image.onload = () => {
                this.draw(canvas_context);
            }
        }
    }
}

/* Represent the game engine including GUI */
class Game {

    constructor() {

        // Canvas objects
        this.game_canvas = document.getElementById("game-canvas");
        this.game_canvas.width = CONFIG.GAME_WIDTH;
        this.game_canvas.height = CONFIG.GAME_HEIGHT;
        this.game_canvas.style.backgroundColor = CONFIG.GAME_BACKGROUND_COLOR;
        this.game_context = this.game_canvas.getContext('2d');

        // Will include info about the game - health, level, score, current gift properites
        this.game_info = {};
        this.score = 0;
        this.level = 1;

        this.gift_image = new Image();
        this.gift_image.src = CONFIG.GIFT_IMAGE;        

        this.status = GAME_STATUS.MENU;

        // Aliens properties
        this.aliens = new Array(CONFIG.ALIENS_COUNT);
        this.aliens_bullets = [];
        this.aliens_shoot_freq = CONFIG.ALIENS_SHOOT_FREQ;
        this.aliens_shoot_freq_range = CONFIG.ALIENS_SHOOT_FREQ_RANGE;
        this.aliens_max_bullets = CONFIG.ALIENS_MAX_BULLETS;
        this.aliens_speed = CONFIG.ALIENS_SPEED;
        this.aliens_movement = {
            "x": CONFIG.ALIENS_MOVEMENT.X,
            "y": CONFIG.ALIENS_MOVEMENT.Y
        }
        this.tick_count = 0;
        this.aliens_freeze = false;

        this.gifts = [];
        this.gift_fallen = false;
        this.gift_status = undefined;

        // Player object
        this.player = undefined;

        // Holds the keys pressed
        this.keys_down = {};

        // Holds the interval id of the game loop
        this.game_loop_interval = undefined;

        // Event listener for pressing key in the game
        window.addEventListener("keydown", (event) => {
            let key_pressed = event.keyCode;
            this.keys_down[key_pressed] = true;

            switch (key_pressed) {

                case (CONFIG.KEY_ENTER): // Starts new game / Unpause the game
                    if (this.status == GAME_STATUS.MENU) {
                        this.status = GAME_STATUS.PLAY;
                        this.tick_count = 0;
                        this.gameStart();
                        this.game_loop_interval = setInterval(() => { this.gameLoop(); }, 1000 / CONFIG.GAME_FPS);
                    } else if (this.status == GAME_STATUS.PAUSE) {
                        this.status = GAME_STATUS.PLAY;
                    }
                    break;

                case (CONFIG.KEY_ESC): // Pausing the game
                    if (this.status == GAME_STATUS.PLAY) {
                        this.status = GAME_STATUS.PAUSE;
                        this.printScreenMessage(CONFIG.GAME_TEXT_PAUSE, CONFIG.GAME_SUBTEXT_PAUSE);
                    }

                default:
                    break;
            }
        });

        // Event listener for releasing pressed keys
        window.addEventListener("keyup", (event) => {
            this.keys_down[event.keyCode] = false;
        });
    }

    // Clean the board from elements
    cleanBoard() {
        this.game_context.clearRect(0, 0, CONFIG.GAME_WIDTH, CONFIG.GAME_HEIGHT);
    }

    // Prints into the screen message for the player [used for menu, pausing, ending]
    printScreenMessage(header_text, subtext) {
        this.cleanBoard();
        this.game_context.font = CONFIG.GAME_TITLE_FONT;
        this.game_context.fillStyle = CONFIG.GAME_FONT_COLOR;
        this.game_context.textBaseline = CONFIG.GAME_FONT_POSITION;
        this.game_context.textAlign = CONFIG.GAME_FONT_POSITION;
        this.game_context.fillText(header_text, CONFIG.GAME_WIDTH / 2, CONFIG.GAME_HEIGHT / 2 - 40);
        this.game_context.font = CONFIG.GAME_TEXT_FONT;
        this.game_context.fillText(subtext, CONFIG.GAME_WIDTH / 2, CONFIG.GAME_HEIGHT / 2);
    }   

    // Initialize game board and game information
    gameStart() {
        this.initializeBoard();
        this.initializeInfo();
    }

    // Initialize the game board for first play
    initializeBoard() {
        this.cleanBoard();
        this.initializeObjects();
    }

    // Initialize all the objects of the game for the first play    
    initializeObjects() {    

        this.aliens_movement = {
            "x": CONFIG.ALIENS_MOVEMENT.X,
            "y": CONFIG.ALIENS_MOVEMENT.Y
        };
        this.aliens_bullets = [];        
        this.aliens_speed = CONFIG.ALIENS_SPEED;
        this.gifts = [];
        this.gift_fallen = false;
        this.gift_status = undefined;

        let alien_current_location = new Location(CONFIG.ALIEN_START_POS_X, CONFIG.ALIEN_START_POS_Y);
        let player_start_location = new Location(CONFIG.PLAYER_START_POS_X, CONFIG.PLAYER_START_POS_Y);

        let player_image = new Image();
        player_image.src = CONFIG.SPACESHIP_IMAGE;
        player_image.onload = () => {
            this.player = new SpaceShip(player_image, CONFIG.SPACESHIP_WIDTH, CONFIG.SPACESHIP_HEIGHT, player_start_location, CONFIG.SPACESHIP_HEALTH, CONFIG.SPACESHIP_SPEED);
            this.player.draw(this.game_context);
        };

        let alien_image = new Image();
        alien_image.src = CONFIG.ALIENSHIP_IMAGE;
        alien_image.onload = () => {
            for (let index = 0; index < this.aliens.length; index++) {
                let current_location = new Location(alien_current_location.x, alien_current_location.y);
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

    // Initialize the game information for first play
    initializeInfo() {
        if (this.player) {
            this.player.health = CONFIG.SPACESHIP_HEALTH;
        }
        this.score = 0;
        this.level = 1;

        let game_info_div = document.getElementById("game-info");
        game_info_div.innerHTML = "";

        let player_lives_image = document.createElement("img");
        player_lives_image.src = CONFIG.SPACESHIP_IMAGE;
        player_lives_image.height = CONFIG.SPACESHIP_HEIGHT;
        player_lives_image.width = CONFIG.SPACESHIP_WIDTH;
        let lives_text = document.createTextNode("Lives: " + (this.player ? this.player.health : CONFIG.SPACESHIP_HEALTH));

        this.game_info.player_lives = document.createElement("h1");
        this.game_info.player_lives.appendChild(lives_text);
        this.game_info.player_lives.appendChild(player_lives_image);

        let level_text = document.createTextNode("Level: " + this.level);
        this.game_info.level = document.createElement("h1");
        this.game_info.level.appendChild(level_text);

        let score_text = document.createTextNode("Score: " + this.score);
        this.game_info.score = document.createElement("h1");
        this.game_info.score.appendChild(score_text);

        this.game_info.gift_prop = document.createElement("h1");
        this.game_info.gift_prop.innerHTML = "Gift: ";        

        game_info_div.appendChild(this.game_info.score);
        game_info_div.appendChild(this.game_info.player_lives);
        game_info_div.appendChild(this.game_info.level);
        game_info_div.appendChild(this.game_info.gift_prop);
        game_info_div.style.display = "initial";
    }    

    // Updates the player score
    updateScore() {        
        this.game_info.score.innerHTML = "Score: " + this.score;        
    }

    // Updates the player lives
    updateLives() {
        this.game_info.player_lives.firstChild.data = "Lives: " + this.player.health;
    }

    // Update the objects location and draw them on the canvas
    updateGame() {

        // Check for all collisions and update all bullets locations  
        this.player.updateBullets();
        this.updateBulletsCollisions();
        this.updateAliensBullets();

        // Updates the gifts positions
        this.updateGifts();
        this.drawObjects();
        
    }

    // Draw all the objectss in the game
    drawObjects() {
        // Draw all aliens        
        for (let index = 0; index < this.aliens.length; index++) {
            if (this.aliens[index].alive) {
                this.aliens[index].draw(this.game_context);
            }
        }

        // Draw player's bullets        
        for (let index = 0; index < this.player.bullets.length; index++) {
            this.player.bullets[index].draw(this.game_context);
        }

        // Draw aliens bullets
        for (let index = 0; index < this.aliens_bullets.length; index++) {
            this.aliens_bullets[index].draw(this.game_context);
        }

        // Draw the gifts
        for (let index = 0; index < this.gifts.length; index++) {
            this.gifts[index].draw(this.game_context);
        }

        // Draw player
        this.player.draw(this.game_context);
    }

    // Update gifts status and locations
    updateGifts() {
        for (let index = 0; index < this.gifts.length; index++) {
            if (!Game.isValidLocation(this.gifts[index].location)) {
                this.gifts.splice(index, 1);
                this.gift_fallen = false;
            } else if (this.gifts[index].collide(this.player)) {
                
                // Player got the gift, do something with that
                let gift_options = Object.keys(GIFT_LIST);
                this.gift_status = GIFT_LIST[gift_options[Math.round(Math.random() * (gift_options.length - 1))]];
                this.updateGiftProperties();
                
                this.gift_fallen = false;
                this.gifts.splice(index, 1);
            } else {
                this.gifts[index].update(CONFIG.GIFT_MOVEMENT);
            }
        }
    }

    // Update the gift info and the operation of the specific gift taken by the player
    updateGiftProperties() {
        this.game_info.gift_prop.innerHTML = "Gift: " + GIFT_INFO[this.gift_status];
        switch (this.gift_status) {
            case (GIFT_LIST.REGAIN_LIVE):
                this.player.health += 1;
                this.updateLives();
                break;

            case (GIFT_LIST.ALIENS_ALIVE):
                for (let index = 0; index < this.aliens.length; index++) {
                    this.aliens[index].alive = true;
                }
                break;

            case (GIFT_LIST.ALIENS_FREEZE):
                this.aliens_freeze = true;
                let counter = CONFIG.ALIENS_FREEZE_TIME / 1000;
                this.applyGift(CONFIG.ALIENS_FREEZE_TIME,
                               () => {
                                   this.game_info.gift_prop.innerHTML = "Gift: " + GIFT_INFO[this.gift_status] + " (" + counter + ")";
                                   counter--;
                               },
                               () => {
                                   this.aliens_freeze = false;
                                   this.game_info.gift_prop.innerHTML = "Gift: ";
                               });
                break;
            
            case (GIFT_LIST.ADD_BULLET): 
                this.player.bullets_max_size += 1;
                break;            

            default:
                break;
        }
    }

    /**
     * Apply gift properties for number of seconds
     * @param {*} seconds - number of seconds to apply the gift property
     */
    applyGift(seconds, callback, after_callback) {
        let gift_interval = setInterval(() => {callback();}, 1000);
        setTimeout(() => {
            clearInterval(gift_interval);
            after_callback();
        }, seconds);
    }

    // Updates the key input for pressing two keys at the same time or
    // for pressing without releasing
    updateKeyInput() {

        if (this.keys_down[CONFIG.KEY_SPACE]) {
            this.player.shoot();
        }
        if (this.keys_down[CONFIG.KEY_RIGHT]) {
            this.player.direction = CONFIG.RIGHT_DIR;
            this.player.update();
        }
        if (this.keys_down[CONFIG.KEY_LEFT]) {
            this.player.direction = CONFIG.LEFT_DIR;
            this.player.update();
        }
    }    

    // Update the aliens location
    updateAliens() {

        // Check last alien side
        let index = this.aliens.length - 1;
        if (this.aliens_movement.x < 0) { // Movement left direction
            index = 0;
        }

        let alien_location = new Location(this.aliens[index].location.x, this.aliens[index].location.y);
        alien_location.x += this.aliens_movement.x;

        let dir_move = 'x';

        if (!Game.isValidLocation(alien_location)) {
            this.aliens_movement.x *= -1;
            dir_move = 'y';
            if (this.aliens_speed > CONFIG.ALIENS_SPEED_REDUCE) {
                this.aliens_speed -= CONFIG.ALIENS_SPEED_REDUCE;
            }
        }

        for (let index = 0; index < this.aliens.length; index++) {
            let random_shooter = Math.round(Math.random() * this.aliens_shoot_freq_range);
            if ((this.aliens[index].alive) && (random_shooter == this.aliens_shoot_freq) && (this.aliens_bullets.length < this.aliens_max_bullets)) {
                let bullet_location = new Location(this.aliens[index].location.x - this.aliens[index].width / 2, this.aliens[index].location.y);
                this.aliens_bullets.push(new Bullet(CONFIG.BULLET_WIDTH, CONFIG.BULLET_HEIGHT, bullet_location));
            }
            this.aliens[index].location[dir_move] += this.aliens_movement[dir_move];
        }
    }

    // Update aliens bullets location
    updateAliensBullets() {

        for (let index = 0; index < this.aliens_bullets.length; index++) {
            if (this.aliens_bullets[index].location.y > CONFIG.GAME_WIDTH) {
                this.aliens_bullets.splice(index, 1);
            } else if (this.aliens_bullets[index].collide(this.player)) {
                this.player.damage();
                this.updateLives();
                this.aliens_bullets.splice(index, 1);
            } else {
                this.aliens_bullets[index].update(CONFIG.BULLET_MOVEMENT);
            }
        }
    }

    // Update player bullets location and collisions with aliens
    updateBulletsCollisions() {

        for (let index = 0; index < this.player.bullets.length; index++) {
            for (let alien_index = this.aliens.length - 1; alien_index >= 0; alien_index--) {
                if (this.aliens[alien_index].alive &&
                    this.player.bullets[index].collide(this.aliens[alien_index])) {                    
                    
                    // Spawn gift
                    if ((!this.gift_fallen) &&
                        (Math.round(Math.random() * CONFIG.GIFT_FREQ_RANGE) % CONFIG.GIFT_FREQ == 0)) {
                        this.gift_fallen = true;
                        let gift_location = new Location(this.aliens[alien_index].location.x,
                                                         this.aliens[alien_index].location.y);
                        this.gifts.push(new Gift(this.gift_image, CONFIG.GIFT_WIDTH, CONFIG.GIFT_HEIGHT, gift_location));                        
                    }

                    this.aliens[alien_index].alive = false;
                    this.player.bullets.splice(index, 1);
                    this.score += CONFIG.ALIENS_KILL_SCORE;
                    this.updateScore();
                    break;
                }
            }
        }
    }    

    // Handle the full game engine loop for playing the game
    gameLoop() {

        // Stops the game loop interval
        if (this.status == GAME_STATUS.WIN || this.status == GAME_STATUS.LOSE) {
            clearInterval(this.game_loop_interval);
            this.endGame();
            return;
        }

        if (this.status != GAME_STATUS.PAUSE) {
            this.cleanBoard();
            this.updateKeyInput();
            this.updateGame();

            // Update movement tick count for the aliens
            this.tick_count++;

            // Update aliens positions if they need to move
            if (this.tick_count % this.aliens_speed == 0 && !this.aliens_freeze) {
                this.updateAliens();
                this.tick_count = 0;
                this.checkEndGame();
            }
        }
    }

    // Checking for the game end to stop the game loop
    checkEndGame() {

        // Player died
        if (this.player.health == 0) {
            this.status = GAME_STATUS.LOSE;
            return;
        }

        // Find the bottom alien that still alive
        let bottom_alien_index = undefined;
        let aliens_alive = 0;
        for (let index = this.aliens.length - 1; index >= 0 && !bottom_alien_index; index--) {
            if (this.aliens[index].alive) {
                bottom_alien_index = index;
                aliens_alive += 1;
            }
        }

        if (!aliens_alive) {
            this.status = GAME_STATUS.WIN;
        } else if (this.aliens[bottom_alien_index].location.y + CONFIG.ALIENSHIP_HEIGHT / 2 >= this.player.location.y) {
            this.status = GAME_STATUS.LOSE;
        }
    }

    // Ends the game and shows if the player win or lose
    endGame() {

        let [font_color, text_endgame] = (this.status == GAME_STATUS.WIN ?
            [CONFIG.WIN_FONT_COLOR, CONFIG.GAME_TEXT_WIN] : [CONFIG.LOSE_FONT_COLOR, CONFIG.GAME_TEXT_LOSE]);
        this.printScreenMessage(CONFIG.GAME_TEXT_END, CONFIG.GAME_SUBTEXT_END);
        this.game_context.font = CONFIG.GAME_TITLE_FONT;
        this.game_context.textBaseline = CONFIG.GAME_FONT_POSITION;
        this.game_context.textAlign = CONFIG.GAME_FONT_POSITION;
        this.game_context.fillStyle = font_color;
        this.game_context.fillText(text_endgame, CONFIG.GAME_WIDTH / 2, CONFIG.GAME_HEIGHT / 2 + 40);

        // Return font_color to the previous one
        this.game_context.fillStyle = CONFIG.GAME_FONT_COLOR;
        this.status = GAME_STATUS.MENU;
    }

    /**
     * Helper function to check if element is out of the borders of the game
     * @param {*} location - location to check
     */
    static isValidLocation(location) {
        return ((location.x < CONFIG.GAME_WIDTH &&
                 location.x >= 0) &&
                (location.y < CONFIG.GAME_HEIGHT &&
                 location.y >= 0));
    }
}

// Start the game menu when the window load
window.onload = function () {
    let game = new Game();
    game.printScreenMessage(CONFIG.GAME_TEXT_MENU, CONFIG.GAME_SUBTEXT_MENU);
}
