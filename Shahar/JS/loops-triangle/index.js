//this is an excersise in JS from w3 schools: https://www.w3resource.com/javascript-exercises/javascript-conditional-statements-and-loops-exercises.php
//Ex num. 10.


function calculate(){

    let x;
    x = document.getElementById("integer").value;
    x = parseInt(x,10);
    if(!(Number.isInteger(x)) || x < 0){
        document.getElementById("result").innerHTML = "BAD VALUE! " + x;
        console.log("BAD VALUE! " + x );
        return;
    }

    let text="";
    for(let i = 0 ; i < x ; i++){
        for(let j = 1 ; j <= i+1 ; j++){
            text+= "* ";
        }
        text += '<br />';
    }

    document.getElementById("result").innerHTML = text;
    return;

}

