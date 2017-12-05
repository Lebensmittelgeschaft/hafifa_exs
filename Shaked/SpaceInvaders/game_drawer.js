/* Represent game drawer on the canvas for the 'Space Invaders' 
   @author Shaked Manes */

let game_canvas = document.getElementById("game-canvas");
let game_context = game_canvas.getContext('2d');

/* Represent game drawer for drawing on the canvas */
class Drawer {

    static cleanBoard() {
        game_context.clearRect(0, 0, CONFIG.GAME_WIDTH, CONFIG.GAME_HEIHGT);        
    }

    static drawMenu() {
        game_context.font = "30px Arial";
        game_context.fillStyle = "white";
        game_context.textBaseline = "center";
        game_context.textAlign = "center";
        game_context.fillText("Space Invaders", CONFIG.GAME_WIDTH / 2, CONFIG.GAME_HEIHGT / 2 - 40);
        game_context.font = "16px Arial";     
        game_context.fillText("Press 'Enter' to start.", CONFIG.GAME_WIDTH / 2, CONFIG.GAME_HEIGHT / 2);
    }

    static drawShip(ship) {
        game_context.drawImage(ship.image, ship.location.x, ship.location.y, ship.width, ship.height);        
    }
}