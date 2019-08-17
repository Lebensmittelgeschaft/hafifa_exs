window.onload = function () {
    let canvas = document.getElementById("drawing_board");
    let canvas_context = canvas.getContext('2d');
    let color_rgb = 255;
    for (let circle_pos = 0;
         circle_pos <= canvas.height;
         circle_pos += canvas.height / 7) {

        canvas_context.fillStyle = "rgb(" + color_rgb +
                                    "," + color_rgb + 
                                    "," + color_rgb + ")";
        canvas_context.beginPath();        
        canvas_context.arc(circle_pos, circle_pos, 10, 0, 2 * Math.PI);
        canvas_context.closePath();
        canvas_context.fill();
        color_rgb -= 42.5;
    }
}

