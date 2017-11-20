// Task number 5

String.prototype.firstToUpperCase = function() {
    console.log(this.charAt(0) + this.substr(1, this.length));
    return this.charAt(0).toUpperCase() + this.substr(1, this.length);
}


function changeToUpperCase() {
    var txt = document.getElementById("str").value;;
    if (txt !== "") {
        var words = txt.split(" ");
        var upperString = "";
        var newString = document.getElementById("newString");
        for (var i=0; i < words.length; i++) {
            upperString += words[i].firstToUpperCase() + ' ';
        }
        var len = upperString.length;
        // take the string without the last space at the end
        newString.innerHTML = "The new string is: " + upperString.substr(0,len-1);
    }
    else alert("Please enter a string");
}
