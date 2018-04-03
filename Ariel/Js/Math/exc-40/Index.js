var changeColor  = function() {
    var red = Math.round(Math.random()  * 255);
    var green = Math.round(Math.random()  * 255);
    var blue = Math.round(Math.random()  * 255);

    document.body.style.backgroundColor = "rgb(" + red + "," + green + "," + blue + ")";
}