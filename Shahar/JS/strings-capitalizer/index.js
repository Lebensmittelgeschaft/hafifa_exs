//this is an excersise in JS from w3 schools: https://www.w3resource.com/javascript-exercises/javascript-string-exercises.php
//Ex num.41.


function capitalize(){

    myText = document.getElementById("myText").value;
    

    for(let i = 0 ; i < myText.length-1 ; i++){
        myText = myText.toUpperCase();
    }



    //Apparently, you can do this by just 'var newArray = array.slice();'
    // for(element in array){
    //     newArray[i] = array[i];
    //     i++;
    // }
    // var tmp = newArray[0];
    // newArray[0] = newArray[newArray.length - 1];
    // newArray[newArray.length - 1] = tmp;

    document.getElementById("result").innerHTML = myText;
    
    return;

}


