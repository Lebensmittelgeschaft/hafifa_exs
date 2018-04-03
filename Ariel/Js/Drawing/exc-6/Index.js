var canvasCtx = document.getElementById('canvas').getContext('2d');

var currX = 40;
var currY = 40;
const R = 35;
var currColor = 000000;
var tmp;

for(let index = 0; index < 6; index++) {
    currX = currX + R * 2;
    currY = currY + R * 2;
    
    canvasCtx.beginPath();
    canvasCtx.arc(currX, currY, 35, 0, 2 * Math.PI);
    canvasCtx.fillStyle = "#" + tmp;
    canvasCtx.fill();
    
    // currColor += parseInt(""+333333, 16) ---- Converter 333333 from Hexadecimal to Decimal;
    currColor += 3355443;

    tmp = currColor.toString(16);
   
    canvasCtx.stroke();
}