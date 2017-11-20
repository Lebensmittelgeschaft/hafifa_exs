// Task number 22

String.prototype.removeCharAt = function(pos) {
    return this.substr(0, pos) + this.substr(pos+1, this.length);
}

function remove() {
    var txt = document.getElementById("str").value;;
    var pos = document.getElementById("position").value; 
    if (pos !== "") {
        var newString = document.getElementById("newString");
        newString.innerHTML = "The new string is: " + txt.removeCharAt(pos-1);
    }
    else alert("Please choose a position");
}

function changeRange() {
    var txt = document.getElementById("str").value;
    if (txt !== "") {
        var length = txt.length;
        var pos = document.getElementById("position"); 
        pos.setAttribute("max", length);
        pos.setAttribute("min", 1);
        pos.disabled = false;
    }
}
