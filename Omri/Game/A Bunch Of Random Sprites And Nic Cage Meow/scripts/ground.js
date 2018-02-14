class Ground{
    constructor(height,width,backgroundHeight,image,speed,context,canvas){
        this._image            = image; //ground tile image to be drawn
        this._height           = height;//heigh in pixels
        this._backgroundHeight = backgroundHeight;
        this._width            = width ; //width in pixels
        this._speed            = speed; //speed of the ground tile image moving across the canvas
        this._context          = context; //context reference in order render the ground tile image onto the canvas
        this._canvas           = canvas; //canvas reference in order to get the dimensions of the canvas
        this._position         = 0;       //current position of the ground tile image on the canvas

        //update current position
        this.update = ()=>{
            this._position -= this._speed;
            if (this._position < -this._width)
                this._position = 0;
        }

        //redraw the ground tile image onto the screen/canvas from the current position to the edge of the canvas
        //the canvas handles the clipping
        this.render = ()=>{
            for(let i =0; i <= (this._canvas.width/this._width)+1; i++)
                this._context.drawImage(this._image
                     , this._position+(i*this._width)      //x position
                     , this._backgroundHeight-this._height //y position
                     , this._width                         //width to render
                     , this._height);                      //height to render
            }
        //return ground Height
        this.getGroundHeight =()=>{
            return this._backgroundHeight-this._height;
        }

    }
}