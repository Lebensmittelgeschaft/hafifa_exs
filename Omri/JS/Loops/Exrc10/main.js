function diamond(h) {
    let triheight = Math.round(h / 2 - 1);
    let result = "";
    for (let i = 1; i <= triheight; i++) {
        for (let j = 0; j <= triheight - i; j++) {
            result += "&nbsp;";
        }

        for (let j = 0; j < i; j++) {
            result += "*";
        }
        
        result += "<br/>";
    }

    for (let i = triheight; i >= 0; i--) {
        for (let j = triheight - i; j > 0; j--) {
            result += "&nbsp;";
        }

        for (let j = i; j >= 0; j--) {
            result += "*";
        }

        result += "<br/>";
    }

    document.getElementById('result').innerHTML = result;
}