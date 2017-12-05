/* Represent game drawer on the canvas for the 'Space Invaders' 
   @author Shaked Manes */



/* Represent game drawer for drawing on the canvas */
class Drawer {

    constructor() {
        this.game_canvas = document.getElementById("game-canvas");
        this.game_canvas.width = CONFIG.GAME_WIDTH;
        this.game_canvas.height = CONFIG.GAME_HEIGHT;
        this.game_context = this.game_canvas.getContext('2d');
    }
    cleanBoard() {
        this.game_context.clearRect(0, 0, CONFIG.GAME_WIDTH, CONFIG.GAME_HEIGHT);        
    }

    drawMenu() {
        this.game_context.font = CONFIG.GAME_TITLE_FONT;
        this.game_context.fillStyle = CONFIG.GAME_FONT_COLOR;
        this.game_context.textBaseline = CONFIG.GAME_FONT_POSITION;
        this.game_context.textAlign = CONFIG.GAME_FONT_POSITION;
        this.game_context.fillText(CONFIG.GAME_NAME, CONFIG.GAME_WIDTH / 2, CONFIG.GAME_HEIGHT / 2 - 40);
        this.game_context.font = CONFIG.GAME_TEXT_FONT;     
        this.game_context.fillText("Press 'Enter' to start.", CONFIG.GAME_WIDTH / 2, CONFIG.GAME_HEIGHT / 2);
    }

    drawShip(ship) {        
        this.game_context.drawImage(ship.image, ship.location.x, ship.location.y, ship.width, ship.height);
    }
}