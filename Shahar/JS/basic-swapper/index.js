//this is an excersise in JS from w3 schools: https://www.w3resource.com/javascript-exercises/javascript-basic-exercises.php
//Ex num. 80.


function swap(){

    array = document.getElementById("array").value;
    array = array.split(" ");
    var newArray = [];
    var i = 0;
    //Apparently, you can do this by just 'var newArray = array.slice();'
    for(element in array){
        newArray[i] = array[i];
        i++;
    }
    var tmp = newArray[0];
    newArray[0] = newArray[newArray.length - 1];
    newArray[newArray.length - 1] = tmp;

    document.getElementById("original").innerHTML = '[' + array + ']';
    document.getElementById("new").innerHTML = '[' + newArray + ']';
    return;

}


