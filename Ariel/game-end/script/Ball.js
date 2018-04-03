const BALL_URL    = "../images/pokemon-go/ball1.png";
let ballInstance = null;

class Ball {
    constructor(x, y) {
        // Singleton pattern
        if(!ballInstance){
            ballInstance = this;
            this.xCoord = x;
            this.yCoord = y;
            this.img = new Image();
            this.img.src = BALL_URL;
        }

        return (ballInstance);
    }
}