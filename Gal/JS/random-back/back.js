// Task number 40

function randomBack() {
    var r = Math.floor((Math.random() * 255 + 1));
    var g = Math.floor((Math.random() * 255 + 1));
    var b = Math.floor((Math.random() * 255 + 1));

    console.log(r);
    console.log(g);
    console.log(b);

    var page = document.getElementsByTagName('body')[0];
    page.style.backgroundColor = 'rgb(' + r + ',' + g + ',' + b + ')';


}
