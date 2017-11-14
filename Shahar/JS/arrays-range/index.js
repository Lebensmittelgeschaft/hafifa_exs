//this is an excersise in JS from w3 schools: https://www.w3resource.com/javascript-exercises/javascript-array-exercises.php
//Ex num. 40.


function calculate(){

    let x = "";
    x = document.getElementById("range").value;
    let regEx = new RegExp('[(][0-9]+,[0-9]+[)]'); //the regular expression of "(num1,num2)"
    console.log(regEx.test(x));
    if(!regEx.test(x)){
        document.getElementById("result").innerHTML = "BAD INPUT! TRY AGAIN!";
        return;
    }
    let range = x.substring(1, x.length-1);
    range = range.split(",");
    if(range[0] > range[1]){
        document.getElementById("result").innerHTML = "THE FIRST NUMBER MUST BE BIGGER THAN THE FIRST!";
        return;
    }
    let array = [];
    for(let i = range[0] ; i < range[1] ; i++){
        array[i-range[0]] = i;
    }


    document.getElementById("result").innerHTML = "[" + array + "]";
    // x = x.split(",");
    // x = parseInt(x,10);
    // if(!(Number.isInteger(x)) || x < 0){
    //     document.getElementById("result").innerHTML = "BAD VALUE! " + x;
    //     console.log("BAD VALUE! " + x );
    //     return;
    // }


    // document.getElementById("result").innerHTML = text;
    return;

}

