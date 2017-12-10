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
    "WIN_FONT_COLOR": "gold",
    "LOSE_FONT_COLOR": "red",
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
    "ALIENS_KILL_SCORE": 50,
    "ALIENS_MAX_BULLETS": 5,
    "ALIENS_SHOOT_FREQ": 5,
    "ALIENS_SHOOT_FREQ_RANGE": 10,
    get ALIEN_START_POS_X() { return this.GAME_WIDTH / 6 },
    get ALIEN_START_POS_Y() { return this.GAME_HEIGHT / 10 },
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

let GAME_STATUS = {
    "MENU": 0,    
    "PLAY": 1,
    "PAUSE": 2,
    "WIN": 3,
    "LOSE": 4
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

/* Represent element in the game */
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
        this.speed = speed;
        this.direction = 1;
        this.bullets = [];
        this.bullets_max_size = 1;
    }

    update() {
        let test_location = new Point(this.location.x + this.speed * this.direction, this.location.y);        
        if (this.direction == CONFIG.RIGHT_DIR) {
            test_location.x += this.width / 2;
        }
        
        if (Game.isValidLocation(test_location)) {
            this.location.x += this.speed * this.direction;
        }
    }

    updateBullets() {
        for (let index = 0; index < this.bullets.length; index++) {
            if (this.bullets[index].location.y < 0) {
                this.bullets.splice(index, 1);
            } else {
                this.bullets[index].update( - CONFIG.BULLET_MOVEMENT);
            }            
        }
    }

    shoot() {
        if (this.bullets.length != this.bullets_max_size) {
            this.bullets.push(new Bullet(CONFIG.BULLET_WIDTH, CONFIG.BULLET_HEIGHT, new Point(this.location.x + this.width / 2, this.location.y)));
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

class Bullet {
    constructor(width, height, location) {        
        this.width = width;
        this.height = height;
        this.location = location;
    }

    draw(canvas_context) {
        canvas_context.fillRect(this.location.x, this.location.y, this.width, this.height);
    }

    update(movement_y) {
        this.location.y += movement_y;
    }
}

class Game {

    constructor() {
        this.game_canvas = document.getElementById("game-canvas");
        this.game_canvas.width = CONFIG.GAME_WIDTH;
        this.game_canvas.height = CONFIG.GAME_HEIGHT;
        this.game_canvas.style.backgroundColor = CONFIG.GAME_BACKGROUND_COLOR;
        this.game_context = this.game_canvas.getContext('2d');

        // Will include info about the game - health, level, score
        this.game_info = {};

        // TODO - Need to implement score and level
        this.score = 0;
        this.level = 0;

        this.status = GAME_STATUS.MENU;
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

        this.player = undefined;      

        this.gameLoopInterval = undefined;
        this.keys_down = {};        
        window.addEventListener("keydown", (event) => {
            let key_pressed = event.keyCode;
            this.keys_down[key_pressed] = true;

            switch (key_pressed) {           

                case (CONFIG.KEY_ENTER):
                    if (this.status == GAME_STATUS.MENU) {
                        this.status = GAME_STATUS.PLAY;
                        this.tick_count = 0;
                        this.gameStart();
                        this.gameLoopInterval = setInterval(() => {this.gameLoop();}, 1000/CONFIG.GAME_FPS);
                    } else if (this.status == GAME_STATUS.PAUSE) {
                        this.status = GAME_STATUS.PLAY;
                    }
                    break;
                
                case (CONFIG.KEY_ESC):
                    if (this.status == GAME_STATUS.PLAY) {
                        this.pause();
                    }                

                default:
                    break;
            }
        });

        window.addEventListener("keyup", (event) => {
            this.keys_down[event.keyCode] = false;
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
        this.cleanBoard();
        this.status = GAME_STATUS.MENU;
        this.game_context.font = CONFIG.GAME_TITLE_FONT;
        this.game_context.fillStyle = CONFIG.GAME_FONT_COLOR;
        this.game_context.textBaseline = CONFIG.GAME_FONT_POSITION;
        this.game_context.textAlign = CONFIG.GAME_FONT_POSITION;
        this.game_context.fillText(CONFIG.GAME_NAME, CONFIG.GAME_WIDTH / 2, CONFIG.GAME_HEIGHT / 2 - 40);
        this.game_context.font = CONFIG.GAME_TEXT_FONT;
        this.game_context.fillText("Press 'Enter' to start.", CONFIG.GAME_WIDTH / 2, CONFIG.GAME_HEIGHT / 2);        
    }

    pause() {
        this.cleanBoard();
        this.status = GAME_STATUS.PAUSE;
        this.game_context.font = CONFIG.GAME_TITLE_FONT;
        this.game_context.fillStyle = CONFIG.GAME_FONT_COLOR;
        this.game_context.textBaseline = CONFIG.GAME_FONT_POSITION;
        this.game_context.textAlign = CONFIG.GAME_FONT_POSITION;
        this.game_context.fillText(CONFIG.GAME_NAME + " Paused", CONFIG.GAME_WIDTH / 2, CONFIG.GAME_HEIGHT / 2 - 40);
        this.game_context.font = CONFIG.GAME_TEXT_FONT;
        this.game_context.fillText("Press 'Enter' to unpause.", CONFIG.GAME_WIDTH / 2, CONFIG.GAME_HEIGHT / 2);        
    }    

    /**
     * Initialize the game board for first play
     */
    initializeBoard() {
        this.cleanBoard();        
        this.initializeObjects();
        this.initializeInfo();
    }

    initializeInfo() {         
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
        
        game_info_div.appendChild(this.game_info.score);
        game_info_div.appendChild(this.game_info.player_lives);
        game_info_div.appendChild(this.game_info.level);
    }

    /**
     * Initialize all the objects of the game for the first play
     */
    initializeObjects() {

        this.aliens_movement.x = CONFIG.ALIENS_MOVEMENT.X;

        let alien_current_location = new Point(CONFIG.ALIEN_START_POS_X, CONFIG.ALIEN_START_POS_Y);
        let player_start_location = new Point(CONFIG.PLAYER_START_POS_X, CONFIG.PLAYER_START_POS_Y);

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

    updateScore() {
        this.game_info.score.innerHTML = "Score: " + this.score;
    }

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

    updateGame() {

        // Check for all collisions and delete the collision   
        this.player.updateBullets();
        this.updateBulletsCollisions();
        this.updateAliensBullets();
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

        let dir_move = 'x';

        if (!Game.isValidLocation(alien_location)) {
            this.aliens_movement.x *= -1;
            dir_move = 'y';            
        }

        for (let index = 0; index < this.aliens.length; index++) {
            let random_shooter = Math.round(Math.random() * this.aliens_shoot_freq_range);
            if ((this.aliens[index].alive) && (random_shooter == this.aliens_shoot_freq) && (this.aliens_bullets.length < this.aliens_max_bullets)) {
                let bullet_location = new Point(this.aliens[index].location.x - this.aliens[index].width / 2, this.aliens[index].location.y);
                this.aliens_bullets.push(new Bullet(CONFIG.BULLET_WIDTH, CONFIG.BULLET_HEIGHT, bullet_location));
            }
            this.aliens[index].location[dir_move] += this.aliens_movement[dir_move];
        }
    }

    updateAliensBullets() {
        for (let index = 0; index < this.aliens_bullets.length; index++) {
            if (this.aliens_bullets[index].location.y > CONFIG.GAME_WIDTH) {
                this.aliens_bullets.splice(index, 1);
            } else if ((this.aliens_bullets[index].location.x <= this.player.location.x + this.player.width &&
                        this.aliens_bullets[index].location.x >= this.player.location.x) &&
                       (this.aliens_bullets[index].location.y <= this.player.location.y + this.player.height &&
                        this.aliens_bullets[index].location.y >= this.player.location.y)) {

                // TODO - Add damage to the player and check if the player died for ending the game                
                
                this.aliens_bullets.splice(index, 1);                
            } else {
                this.aliens_bullets[index].update(CONFIG.BULLET_MOVEMENT);
            }
        }
    }

    updateBulletsCollisions() {

        for (let index = 0; index < this.player.bullets.length; index++) {            
            for (let alien_index = this.aliens.length - 1; alien_index >= 0; alien_index--) {
                if (this.aliens[alien_index].alive && 
                    (this.player.bullets[index].location.x <= this.aliens[alien_index].location.x + this.aliens[alien_index].width &&
                     this.player.bullets[index].location.x >= this.aliens[alien_index].location.x) &&
                    (this.player.bullets[index].location.y <= this.aliens[alien_index].location.y + this.aliens[alien_index].height &&
                     this.player.bullets[index].location.y >= this.aliens[alien_index].location.y)) {
                    this.aliens[alien_index].alive = false;
                    this.player.bullets.splice(index, 1);
                    this.score += CONFIG.ALIENS_KILL_SCORE;
                    this.updateScore();
                    break;
                }
            }
        }
    }
    gameLoop() {

        // Stops the game loop interval
        if (this.status == GAME_STATUS.WIN || this.status == GAME_STATUS.LOSE) {
            clearInterval(this.gameLoopInterval);
            // Show end game
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
            if (this.tick_count % this.aliens_speed == 0) {
                this.updateAliens();
                this.tick_count = 0;
                this.checkEndGame();
            }
        }
    }

    checkEndGame() {

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

    endGame() {     

        let [font_color, text_endgame] = (this.status == GAME_STATUS.WIN ? 
                                        [CONFIG.WIN_FONT_COLOR , CONFIG.GAME_TEXT_WIN] : [CONFIG.LOSE_FONT_COLOR, CONFIG.GAME_TEXT_LOSE]);
        this.menu();        
        this.game_context.font = CONFIG.GAME_TITLE_FONT;        
        this.game_context.textBaseline = CONFIG.GAME_FONT_POSITION;
        this.game_context.textAlign = CONFIG.GAME_FONT_POSITION;
        this.game_context.fillStyle = font_color;
        this.game_context.fillText(text_endgame, CONFIG.GAME_WIDTH / 2, CONFIG.GAME_HEIGHT / 2 + 40);
        
        // Return font_color to the previous one
        this.game_context.fillStyle = CONFIG.GAME_FONT_COLOR;
        this.score = 0;
    }

    static isValidLocation(location) {
        return ((location.x < CONFIG.GAME_WIDTH &&
                 location.x >= 0) &&
                (location.y < CONFIG.GAME_HEIGHT &&
                 location.y >= 0));
    }
}

window.onload = function () {
    let game = new Game();
    game.menu();
}
