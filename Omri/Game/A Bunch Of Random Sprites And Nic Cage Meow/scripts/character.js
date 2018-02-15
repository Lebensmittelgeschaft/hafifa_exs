class Character{
  constructor(height,width,groundHeight,runningSprites,jumpingSprites,fallingSprites,slidingSprites,speed,jumpHeight,jumpAudio,context,canvas){
    this._runningSprites   = runningSprites; //an array of images each is a frame from the running animation
    this._jumpingSprites   = jumpingSprites; //an array of images each is a frame from the jumping animation
    this._slidingSprites   = slidingSprites;
    this._fallingSprites   = fallingSprites;
    this._height           = height;//heigh in pixels
    this._jumpHeight       = jumpHeight;
    this._groundHeight     = groundHeight;
    this._width            = width ; //width in pixels
    this._speed            = speed; //speed of animation
    this._context          = context; //context reference in order render the ground tile image onto the canvas
    this._canvas           = canvas; //canvas reference in order to get the dimensions of the canvas


    this._xPosition         = this._width;       
    this._yPosition         = this._groundHeight-this._height;


    this._isJumping        = false;
    this._rachedJumpPeak   = false;
    this._isRunning        = true;
    this._isSliding        = false;

    this._jumpPeakHeight   = this._yPosition - jumpHeight;
    this._jumpStep         = (this._jumpPeakHeight)/(this._speed*this._jumpingSprites.length);

    this._currentRunningSpriteIndex = 0;
    this._currentJumpingSpriteIndex = 0;
    this._currentSlidingSpriteIndex = 0;
    this._frameCounter              = 0; // in order to not change a sprite every frame we will count the frames passed 
                                         //and every set/constant number of frames we will change the sprite

    //getters
    this.getY = ()=>{return this._yPosition;}
    this.getX = ()=>{return this._xPosition;}
    this.getIsRunning = ()=>{return this._isRunning;}
    this.getIsJumping = ()=>{return this._isJumping;}
    this.getIsSliding = ()=>{return this._isSliding;}
    this.getJumpPeakHeight = ()=>{return this._jumpPeakHeight;}
    this.getHitBox = ()=>{return{
      x:this._xPosition
        +(!this._isJumping?(this._isSliding?CHARACTER_X_PADDING/2:CHARACTER_X_PADDING):CHARACTER_X_PADDING/2),
      y:this._yPosition-CHARACTER_Y_PADDING+(this._isSliding?SLIDE_HITBOX_THRESHOLD:0),
      width:this._width-CHARACTER_WIDTH_PADDING,
      height:this._height-CHARACTER_HEIGHT_PADDING-((this._isSliding?SLIDE_HITBOX_THRESHOLD:0))
  };}
    //the character has 3 different states therefore based of its state we will invoke a different update function
    this.update = ()=>{
           if(this._isRunning) this.run();
      else if(this._isJumping) this.jump();
      else if(this._isSliding) this.slide();

    }
    //renders the character to the canvas,
    //based on the current state we will select an image and draw it.
    this.render = ()=>{
      let image =(this._isRunning)?this._runningSprites[this._currentRunningSpriteIndex]
      :(this._isJumping)?
      ((!this._rachedJumpPeak)?this._jumpingSprites[this._currentJumpingSpriteIndex]
      :this._fallingSprites[this._currentJumpingSpriteIndex])
      :this._slidingSprites[this._currentSlidingSpriteIndex]
        this._context.drawImage(
          image,
          this._xPosition,
          this._yPosition,
          this._width,
          this._height);

    }
    this.run = ()=>{
      this._isRunning = true;
      this._isSliding = false;
      this._isJumping = false;

      this._frameCounter = (this._frameCounter + 1)%speed;
      if(this._frameCounter === 0)
      this._currentRunningSpriteIndex = (this._currentRunningSpriteIndex+1)%this._runningSprites.length;
    }
    this.slide = ()=>{
      this._isRunning = false;
      this._isSliding = true;
      this._isJumping = false;

      this._frameCounter = (this._frameCounter + 1)%speed;
      if(this._frameCounter === 0)
      this._currentSlidingSpriteIndex = (this._currentSlidingSpriteIndex+1)%this._slidingSprites.length;
    }

    this.jump = ()=>{
      if(!this._isJumping)
      jumpAudio.play();
      this._isRunning = false;
      this._isJumping = true;

      if(this._yPosition<this._jumpPeakHeight)this._rachedJumpPeak = true;

      if(this._yPosition>this._groundHeight-this._height){
        this._isRunning = true;
        this._isJumping = false;
        this._rachedJumpPeak = false;
        this._currentJumpingSpriteIndex = 0;
        this._yPosition = this._groundHeight-this._height;

      }

      this._frameCounter = (this._frameCounter + 1)%speed;
      if(this._frameCounter === 0){
      this._currentJumpingSpriteIndex = (this._currentJumpingSpriteIndex+1)%this._jumpingSprites.length;
      this._yPosition +=(this._rachedJumpPeak)? this._jumpStep:-1*this._jumpStep;
      }
    }



    }
  
}

