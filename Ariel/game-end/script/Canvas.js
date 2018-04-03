
const canvasCtx = myCanvas.getContext("2d");

class Canvas {
    constructor() {

    }

    static createRect(x, y, height, width, color) {
        canvasCtx.fillStyle = color || 'black';
        canvasCtx.fillRect(x, y, width, height);
    }

    static createImage(img, x, y, width, height) {
        canvasCtx.drawImage(img, x, y, width, height);
    }

    static clearArea() {
        canvasCtx.clearRect(0, 0, myCanvas.width, myCanvas.height);
    }

    static createText(text, color, x, y, align) {
        const ALIGN_DIR = ["center", "left", "right"];

        // If the direction is exsist
        if(!ALIGN_DIR.includes(align.toLowerCase())) {
            align = "center";
        }

        canvasCtx.font = "25px Arial";
        canvasCtx.textAlign = align;
        canvasCtx.textBaseline = "middle";
        canvasCtx.fillStyle = color;
        canvasCtx.fillText(text, x, y); 
    }

    static printArea() {
        const RGB_TEMP_OCCUPIED_COLOR = {RED: 0, GREEN: 255, BLUE: 0};
        const RGB_AREA_COLOR          = {RED: 0, GREEN: 0, BLUE: 0};
        const RGB_WALL_COLOR          = {RED: 0, GREEN: 0, BLUE: 255};
        const RGB_ENEMY_INJURED       = {RED: 255, GREEN: 0, BLUE: 0};

        let imagedata = canvasCtx.createImageData(myCanvas.width, myCanvas.height);
        this.clearArea();
    
        // Run over the rows canvas (include the starting walls)
        for(let rowIndex = 0; rowIndex < area.height; rowIndex++) {
            // Run over the columns canvas (include the starting walls)
            for(let colIndex = 0; colIndex < area.width; colIndex++) {
                let pixelIndex = (rowIndex * area.width + colIndex) * 4;
                
                // Check the point value
                switch(area.zone[rowIndex][colIndex]) {
                    // Wall value
                    case(STATUS_VALUES.WALL_VALUE):
                    {
                        imagedata.data[pixelIndex] = RGB_WALL_COLOR.RED;
                        imagedata.data[pixelIndex+1] = RGB_WALL_COLOR.GREEN;
                        imagedata.data[pixelIndex+2] = RGB_WALL_COLOR.BLUE;
                        imagedata.data[pixelIndex+3] = 255;
    
                        break;
                    }
    
                    // Occupied area value
                    case(STATUS_VALUES.TEMP_OCCUPIED_VALUE):
                    {
                        imagedata.data[pixelIndex] = RGB_TEMP_OCCUPIED_COLOR.RED;
                        imagedata.data[pixelIndex+1] = RGB_TEMP_OCCUPIED_COLOR.GREEN;
                        imagedata.data[pixelIndex+2] = RGB_TEMP_OCCUPIED_COLOR.BLUE;
                        imagedata.data[pixelIndex+3] = 255;
    
                        break;
                    }
    
                    // Injured area value
                    case(STATUS_VALUES.ENEMY_INJURED_VALUE):
                    {
                        imagedata.data[pixelIndex] = RGB_ENEMY_INJURED.RED;
                        imagedata.data[pixelIndex+1] = RGB_ENEMY_INJURED.GREEN;
                        imagedata.data[pixelIndex+2] = RGB_ENEMY_INJURED.BLUE;
                        imagedata.data[pixelIndex+3] = 255;
    
                        break;
                    }
    
                    // Empty area value
                    case(STATUS_VALUES.AREA_VALUE):
                    {
                        imagedata.data[pixelIndex] = RGB_AREA_COLOR.RED;
                        imagedata.data[pixelIndex+1] = RGB_AREA_COLOR.GREEN;
                        imagedata.data[pixelIndex+2] = RGB_AREA_COLOR.BLUE;
                        imagedata.data[pixelIndex+3] = 255;
    
                        break;
                    }
                }
            }
        }

        canvasCtx.putImageData(imagedata, 0, 0);
    }
}