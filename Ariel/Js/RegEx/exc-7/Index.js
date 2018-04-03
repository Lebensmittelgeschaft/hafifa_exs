var checkIP = function(ip) {
    var regEx = new RegExp(/^(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|$)){4}$/)
    
    if (regEx.test(ip)) {
        return (true);
    } else {
        return(false);
    }
}

var value = prompt("Please enter a value");

if(checkIP(value)) {
    alert("Valid IP");
} else {
    alert("Invalid IP");
}