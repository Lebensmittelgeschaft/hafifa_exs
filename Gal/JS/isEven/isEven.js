// Task number 7

function isEven(num) {
    if (num === 0) {
        return true;
    }
    // if num < 0 its mean the number was float (e.g 6.6) so it wont 
    // stop at 0 or 1.
    if (num === 1 || num < 0) {
        return false;
    }
    return isEven(num-2);
} 

function checkNumber() {
    var num = Number(document.getElementById("str").value);
    if (num < 0) {
        num *= -1;
    }
    if (Number.isInteger(num)) {
        var newString = document.getElementById("newString");
        var result = "even"
        if (!isEven(num)) {
            result = "odd"
        }
        newString.innerHTML = "The number is: " + result;
    }
    else alert("Please enter a valid number (integer)");
}
