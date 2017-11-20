// Task number 6

var coords = [ [150,50], [20,85], [160,95] ];
var c = document.getElementById("canv");
var ctx = c.getContext("2d");
for (var i = 1; i < 7; i++) {
    ctx.beginPath();
    ctx.arc(i * 20, i * 20 , 7 , 0, Math.PI * 2);
    ctx.stroke();
}
