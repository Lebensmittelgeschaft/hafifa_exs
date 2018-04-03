const MAX_ENEMY = 19;
const ENEMY_BASE_URL = "../images/pokemon-go/enemy";
let currEnemyIndex = 0;

class Enemy {
    constructor(x, y) {
        this.xCoord = x;
        this.yCoord = y
        this.xSpeed = Math.round(Math.random()) * 2 - 1;
        this.ySpeed = Math.round(Math.random()) * 2 - 1;
        this.img = new Image();

        // Check if all the images of enemies are used
        if(currEnemyIndex < MAX_ENEMY){
            this.img.src = ENEMY_BASE_URL + currEnemyIndex + ".png";
        } else {
            this.img.src = ENEMY_BASE_URL + Math.floor(Math.random() * MAX_ENEMY) + ".png";
        }
        
        currEnemyIndex++;
    }

    static initEnemyIndex() {
        currEnemyIndex = 0;
    }
}