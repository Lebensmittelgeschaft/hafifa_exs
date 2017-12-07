function drawCircles(CIRCLES_NUM) {
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);

    for (let i = 0; i < CIRCLES_NUM; i++) {
        ctx.beginPath();
        ctx.arc(270 / CIRCLES_NUM + 600 * i / CIRCLES_NUM,
                270 / CIRCLES_NUM + 600 * i / CIRCLES_NUM,
                180 / CIRCLES_NUM, 0, 2 * Math.PI);
        let grayscale = 255 - 255 / CIRCLES_NUM * i;
        ctx.fillStyle = "#" + parseInt((1 << 24) + (grayscale << 16) + (grayscale << 8) + grayscale).toString(16).slice(1);
        ctx.fill();
        ctx.stroke();
    }
}