let areaInstance = null;

class Area {
    constructor() {
        // Singleton pattern
        if(!areaInstance) {
            areaInstance = this;
            this.height = myCanvas.height;
            this.width = myCanvas.width
            this.zone = new Array(this.height);

            // Defines the area
            for (let index = 0; index < this.height; index++) {
                this.zone[index] = new Array(this.width);
            }
        }
        
        return (areaInstance);
    }

    initMatrix(value, fromIndexHeight, fromIndexWidth) {
        // Run over the rows canvas (between two points)
        for(let rowIndex = fromIndexHeight; rowIndex < this.height - fromIndexHeight; rowIndex++) {
            // Run over the columns canvas (between two points)
            for(let colIndex = fromIndexWidth; colIndex < this.width - fromIndexWidth; colIndex++) {
                this.zone[rowIndex][colIndex] = value;
            }
        }
    }

    isLeadToWrongValueX(height, width, speed, x, y, valueToCompare) {
        // Check if object is will not touch in place with some value(at the X axis)
        if((this.zone[y][x + speed] !== valueToCompare)              ||
           (this.zone[y][x + speed + width - 1] !== valueToCompare)  ||
           (this.zone[y + height - 1][x + speed] !== valueToCompare) ||
           (this.zone[y + height - 1][x + speed + width - 1] !== valueToCompare)) {
            return(true);
        }

        return (false);
    }

    isLeadToWrongValueY(height, width, speed, x, y, valueToCompare) {
        // Check if object is will not touch in place with some value(at the Y axis)
        if((this.zone[y + speed][x] !== valueToCompare)              ||
           (this.zone[y + speed + height - 1][x] !== valueToCompare) ||
           (this.zone[y + speed][x + width - 1] !== valueToCompare)  ||
           (this.zone[y + speed + height - 1][x + width - 1] !== valueToCompare)) {
            return(true);
        }
 
        return (false);
    }   
}