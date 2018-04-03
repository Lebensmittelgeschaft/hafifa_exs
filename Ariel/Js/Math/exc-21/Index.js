function romanize(num) {
    if(isNaN(num)) {
        return (null);
    }
    
    var lookup = {
        M:1000,
        CM:900,
        D:500,
        CD:400,
        C:100,
        XC:90,
        L:50,
        XL:40,
        X:10,
        IX:9,
        V:5,
        IV:4,
        I:1};
    var roman = '';
       
    for (let key in lookup ) {
        while ( num >= lookup[key] ) {
            roman += key;
            num -= lookup[key];
        }
    }

    return roman;
}

var nNum = prompt("Please enter a number");

var romanResult = romanize(nNum);
if(romanResult == null) {
    alert("Please enter only number");
} else {
    alert("The Roman numerals value of " + nNum + " is: " + romanResult);
}
