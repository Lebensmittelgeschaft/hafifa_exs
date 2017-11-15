//this is an excersise in JS from w3 schools: https://www.w3resource.com/javascript-exercises/javascript-conditional-statements-and-loops-exercises.php
//Ex num. 10.


function validate(){

    let regex = new RegExp("[0-9a-zA-Z]+([\-\.]{1}[a-zA-Z])*\.[a-zA-Z]+");
    console.log(regex );
    let domain = document.getElementById("domain").value;

    document.getElementById("result").innerHTML = regex.test(domain);
    return;

}

