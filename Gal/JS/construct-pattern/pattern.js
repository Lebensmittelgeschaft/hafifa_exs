// Task number 10

function validatePattern(pattern) {
    if (pattern === "") {
        alert("Please entrer a pattern");
        return false;
    }
    if (pattern.length > 1) {
        alert("Please choose pattern with one character")
        return false;
    }
    return true;
}

function constructPattern() {
    var pattern = document.getElementById("str").value;
    var num = document.getElementById("num").value;
    if (validatePattern(pattern)) {
        var newPattern = document.getElementById("newPattern");
        var totalPattern = "";
        var j;
        for (var i = 0; i < num; i++) {
            for (j = num-i-1; j < num; j++) {
                totalPattern += pattern;
            }
            totalPattern += "<br>";
        }
        newPattern.innerHTML = totalPattern;
    }
}
