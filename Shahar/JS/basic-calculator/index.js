//this is an excersise in JS from w3 schools: https://www.w3resource.com/javascript-exercises/javascript-basic-exercises.php
//Ex num. 10.

//I know the code is duplicated and honestly it makes me sick to see it,
// but im feeling lazy right now and the project is very simple so meh.

function add(){

    num1 = document.getElementById("num1").value;
    num2 = document.getElementById("num2").value;
    document.getElementById("result").innerHTML = parseInt(num1,10) + parseInt(num2, 10);
    return;

}

function sub(){

    num1 = document.getElementById("num1").value;
    num2 = document.getElementById("num2").value;
    document.getElementById("result").innerHTML = parseInt(num1,10) - parseInt(num2, 10);
    return;

}
function mult(){

    num1 = document.getElementById("num1").value;
    num2 = document.getElementById("num2").value;
    document.getElementById("result").innerHTML = parseInt(num1,10) * parseInt(num2, 10);
    return;

}

function div(){

    num1 = document.getElementById("num1").value;
    num2 = document.getElementById("num2").value;
    document.getElementById("result").innerHTML = parseInt(num1,10) / parseInt(num2, 10);
    return;

}
