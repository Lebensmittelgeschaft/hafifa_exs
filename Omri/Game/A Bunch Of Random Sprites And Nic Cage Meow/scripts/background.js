class Background {
    constructor(height,width,image,speed,context,canvas){
        this._image    = image; //background image to be drawn
        this._height   = height;//heigh in pixels
        this._width    = width ; //width in pixels
        this._speed    = speed; //speed of the background moving across the canvas
        this._context  = context; //context reference in order render the background onto the canvas
        this._canvas   = canvas; //canvas reference in order to get the dimensions of the canvas
        this._position = 0;       //current position of the background on the canvas

        //update current position
        this.update = ()=>{
            this._position -= this._speed;
            if (this._position < -this._width)
              this._position = 0;
        }
        //redraw the background onto the screen\canvas from the current position to the edge of the canvas
        //the canvas handles the clipping
        this.render = ()=>{
        for(let i =0; i <= (this._canvas.width/this._width)+1; i++)
                    this._context.drawImage(this._image
                         , this._position+(i*this._width)  //x position
                         , 0                               //y position
                         , this._width                     //width to render
                         , this._height);                  //height to render
        }
    }


}