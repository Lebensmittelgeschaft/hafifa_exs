//this is an excersise in JS from w3 schools: https://www.w3resource.com/javascript-exercises/javascript-math-exercises.php
//Ex num.43.


function calculate(){

    let from = document.getElementById("from").value;
    let to = document.getElementById("to").value;

    if(from > to){
        document.getElementById("result").innerHTML = "ERROR: FROM IS LARGER THAN TO!";
        return;
    }
    let array = [];
    for(let i = from ; i <= to ; i++){
        let sq = Math.sqrt(i);              //to save the computation every time
        let flag = true;
        for(let j = 2 ; j <= sq ; j++ ){
            if(i%j == 0){
                flag = false;
                break;
            }
        }
        if(flag){
            if(array.length % 9 == 0){
                array[array.length-1] += " <br>";
            }
            array.push(i);
        }
    }

    document.getElementById("result").innerHTML = "[" + array + "]";

    return;

}

