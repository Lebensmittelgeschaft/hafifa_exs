var findRange = function(nLowNun, nHighNun) {
    nHighNun -= 1;
    if(nLowNun == nHighNun) {
        return ["No range"];
    }

    if(nHighNun  == nLowNun + 1) {
        return [nHighNun];
    }
   
    var arrnRange = findRange(nLowNun, nHighNun);
    arrnRange.push(nHighNun);
    
    return(arrnRange);
}

var bIsLegal = false;
var nLow;
var nHigh;

while(!bIsLegal) {
    nLow = prompt("Enter the low number");
    nHigh = prompt("Enter the high number");
  
    if((isNaN(parseInt(nLow))) || (isNaN(parseInt(nHigh)))) {
        alert("Please enter only numbers");
    } else if(parseInt(nLow) >= parseInt(nHigh)){
        alert("The lower number can not be greater than or equal to the big number");
    } else {
        bIsLegal = true;
        alert("The range is: " + findRange(parseInt(nLow), parseInt(nHigh)));
    }
}
  