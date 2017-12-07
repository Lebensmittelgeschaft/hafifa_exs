function amountToCoins(amount, coins) {
    let resultarray = new Array(coins.length);
    for (let i = 0; i < resultarray.length; i++) {
        resultarray[i] = 0;
    }

    let amountleft = amount;
    for (let i = 0; i < coins.length && amountleft >= 0; i++) {
        if (amountleft - coins[i] >= 0) {
            resultarray[i] = parseInt(amountleft / coins[i]);
            amountleft -= coins[i] * resultarray[i];
        }
    }

    let result = [];
    for (let i = 0; i < resultarray.length; i++) {
        for (let j = 0; j < resultarray[i] && resultarray[i] > 0; j++) {
            result.push(coins[i]);
        }
    }

    document.getElementById("result").innerHTML = result.join(", ");
}