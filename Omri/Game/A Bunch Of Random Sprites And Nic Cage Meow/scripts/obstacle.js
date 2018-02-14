class Obstacle{
    constructor(height,width,groundHeight,obstacleSprites,speed,characterHeight,characterJumpHeight,context,canvas){
        this._canvas = canvas;
        this._context = context;
        this._height = height;
        this._speed = speed;
        this._width = width;
        this._xPosition = this._canvas.width-this._width;
        this._yPosition = Math.floor(Math.random() * (groundHeight-characterHeight/2-(groundHeight-characterJumpHeight-characterHeight)) 
        + (groundHeight-characterJumpHeight-characterHeight));
        
        this._obstaclesSprites = obstacleSprites;

        this._currentSpriteIndex = 0;
        this._frameCounter = 0;
        //getters
        this.getY = ()=>{
            return this._yPosition;
          }
        this.getX = ()=>{
            return this._xPosition;
          }
          this.getContext = ()=>{
              return this._context;
          }
        this.getHitBox = ()=>{
            return {
                x:this._xPosition+OBSTACLE_X_PADDING,
                y:this._yPosition-OBSTACLE_Y_PADDING,
                width:this._width-OBSTACLE_WIDTH_PADDING,
                height:this._height-OBSTACLE_hEIGHT_PADDING
            };
        }

        //moves the obstacle with correlation to the stated speed
        //returns if to continue rendering/updating the obstacle or not(filter)
        this.update = ()=>{
            this._xPosition -= this._speed;
            this._frameCounter = (this._frameCounter + 1)%this._speed;
            if(this._frameCounter === 0)
            this._currentSpriteIndex = (this._currentSpriteIndex+1)%this._obstaclesSprites.length;

            return !(this._xPosition < -this._width);
        }
         
        this.render = ()=>{
            this._context.drawImage(this._obstaclesSprites[this._currentSpriteIndex]
                , this._xPosition                 //x position
                , this._yPosition                 //y position
                , this._width                     //width to render
                , this._height);
        }


    }
}