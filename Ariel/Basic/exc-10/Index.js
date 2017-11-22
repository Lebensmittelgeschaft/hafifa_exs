var result = document.querySelector("span");
var message = ['Please insert only numbers', 'Please complete all fields with numbers', 'Can"t divide by zero'];

document.getElementById("multiply").onclick = function() {
    var Numbers =  findNums();
     
    if(checkPropriety(Numbers, message)) {
        result.textContent = +Numbers[0] / +Numbers[1];
    }
};

document.getElementById("divide").onclick = function() {
    var Numbers =  findNums();
    
    if(checkPropriety(Numbers, message)) {
        result.textContent = +Numbers[0] / +Numbers[1];
    }
};

var findNums = function()
{
    return([document.querySelector("input").value,
            document.getElementById("Second-num").value]);
}


var checkPropriety = function(numbers, Mess) {

    if((numbers[0] == "") || (numbers[1] == "")) {
        alert(Mess[1]);

        return(false);
    }

    if(+numbers[1] == 0) {
        alert(Mess[2]);
        
        return(false);
    }

    return(true);
}
