//this is an excersise in JS from w3 schools: https://www.w3resource.com/javascript-exercises/javascript-date-exercises.php
//Ex num.8.


function calculate(){

    let D1 = document.getElementById("D1").value;
    let M1 = document.getElementById("M1").value;
    let Y1 = document.getElementById("Y1").value;
    let date1 = new Date(Y1, M1, D1);

    let D2 = document.getElementById("D2").value;
    let M2 = document.getElementById("M2").value;
    let Y2 = document.getElementById("Y2").value;
    let date2 = new Date(Y2, M2, D2);


    let diff = date2.getTime() - date1.getTime(); 
    diff /= (60*60*24*1000);
    diff = Math.round(diff);




    // let regEx = new RegExp('[(][0-9]+,[0-9]+[)]'); //the regular expression of "(num1,num2)"
    // console.log(regEx.test(x));
    // if(!regEx.test(x)){
    //     document.getElementById("result").innerHTML = "BAD INPUT! TRY AGAIN!";
    //     return;
    // }
    // let range = x.substring(1, x.length-1);
    // range = range.split(",");
    // if(range[0] > range[1]){
    //     document.getElementById("result").innerHTML = "THE FIRST NUMBER MUST BE BIGGER THAN THE FIRST!";
    //     return;
    // }
    // let array = [];
    // for(let i = range[0] ; i < range[1] ; i++){
    //     array[i-range[0]] = i;
    // }


    document.getElementById("result").innerHTML = "date1: [" + date1 + "]" +
     "<br>" + "date2: [" + date2 + "]" + "<br><br>diff in days:" + diff;

    return;

}

