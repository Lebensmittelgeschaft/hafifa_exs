//this is an excersise in JS from w3 schools: https://www.w3resource.com/javascript-exercises/javascript-string-exercises.php
//Ex num.41.


function capitalize(){

    myText = document.getElementById("myText").value;
    

    for(let i = 0 ; i < myText.length-1 ; i++){
        myText = myText.toUpperCase();
    }


    document.getElementById("result").innerHTML = myText;
    
    return;

}


