//this is an excersise in JS from w3 schools: https://www.w3resource.com/javascript-exercises/javascript-basic-exercises.php
//Ex num. 80.


function convert(){

    let sum = 0;
    let coins = [];
    sum = document.getElementById("sum").value;
    coins = document.getElementById("coins").value;
    sum = parseInt(sum,10);
    coins = coins.split(" ");
    let hist = [];      //hist is the histogram of the coins
    for(let i = 0 ; i < coins.length ; i++){
        coins[i] = parseInt(coins[i],10);
        hist[i] = parseInt(0,10);
    }

    console.log("coins: " + coins);
    coins.sort(function(a, b){return a - b});
    coins.reverse();

    if(coins[coins.length-1] <= 0){
        document.getElementById("coins-final").innerHTML = "BAD COINS VALUE!";
        console.log("BAD COINS VALUE!");
        return;
    }

    console.log("sorted coins: " + coins);


    let currSum = 0;
    while(sum - currSum > coins[coins.length-1]){
        for(let i = 0 ; i < coins.length ; i++){
            while(sum - currSum >= coins[i]){
                hist[i]++;
                currSum+=coins[i];
            }
        }
    }
    console.log("hist: " + hist);

    let finalString = "";
    for(let i = 0 ; i < hist.length ; i++){
        finalString += (hist[i] + "X(" + coins[i] + ")"); 
        if(i < hist.length-1){
            finalString += " + ";
        }

    }

    finalString += " = " + sum;

    if(sum-currSum != 0){
        finalString += (" and a redundance of " + (sum-currSum));
    }

    document.getElementById("coins-final").innerHTML = finalString;
    return;

}


