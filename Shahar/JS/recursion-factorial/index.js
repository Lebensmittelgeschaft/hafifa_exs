//this is an excersise in JS from w3 schools: https://www.w3resource.com/javascript-exercises/javascript-recursion-functions-exercises.php
//Ex num. 1.


function calculate(){

    let x;
    x = document.getElementById("integer").value;
    x = parseInt(x,10);
    if(!(Number.isInteger(x)) || x < 0){
        document.getElementById("result").innerHTML = "BAD VALUE! " + x;
        console.log("BAD VALUE! " + x );
        return;
    }


    document.getElementById("result").innerHTML = x;
    return;

}


