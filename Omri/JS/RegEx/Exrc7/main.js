function isip(str) {
    let isstringip = true;
    if (str.indexOf('.') == -1) {
        isstringip = false;
    } else {
        let iparray = str.split('.');
        if (iparray.length == 4) {
            isstringip = iparray.filter(e => {return parseInt(e) <= 255 && parseInt(e) >= 0}).length == 4;
        } else {
            isstringip = false;
        }
    }

    document.getElementById('result').innerHTML = isstringip;
}