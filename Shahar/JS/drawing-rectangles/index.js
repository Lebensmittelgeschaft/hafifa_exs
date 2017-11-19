//drawing ex.3  https://www.w3resource.com/javascript-exercises/javascript-drawing-exercises.php

function draw(){

        let drawing = document.getElementById("drawing");
        let H1 = document.getElementById("H1").value;
        let W1 = document.getElementById("W1").value;
        let H2 = document.getElementById("H2").value;
        let W2 = document.getElementById("W2").value;

        let context = drawing.getContext("2d");

        context.fillStyle = "yellow";
        context.fillRect (20, 20, W1, H1);
        
        context.fillStyle = "rgba(0, 0, 200, 0.3)";
        context.fillRect (50, 50, W2, H2);
}