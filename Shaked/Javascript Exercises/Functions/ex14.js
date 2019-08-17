/* This solution solve the problem in O(coins.length * amount) time complexity */
function amountToCoins(coins, amount) {
    
    // Base cases if theres only one or two elements in coins
    if (coins.length == 1) {
        return (coins[0] == amount ? coins: []);
    } else if (coins.length == 2) {
        return (coins[0] + coins[1] == amount ? coins : []);
    }

    // Create table of boolean values indicates the sums from 0 to amount
    // We can create from the coins
    let subsetsum_table = Array(coins.length);

    // Create the array with size of the amount for determine if the sum can create
    // With each element in the array.
    // Also set all the sums of zero to true because we can acquire them without any number;
    for (let index = 0; index < coins.length; index++) {
        subsetsum_table[index] = Array(amount + 1);
        subsetsum_table[index][0] = true;        
    }    

    for (let current_sum = 1; current_sum <= amount; current_sum++) {
        subsetsum_table[0][current_sum] = false;
    }

    // Check if the first element in the coins is considered in the sums range.
    // If so, we need to count this as true because it can be acquired by the first element.
    if (coins[0] <= amount) {
        subsetsum_table[0][coins[0]] = true;
    }
    
    // Navigating through all the elements and finding if the sum can be acquire by
    // each element, considered by previous elements choices if the sum is bigger than
    // actual sum.
    for (let coins_element = 1; coins_element < coins.length; coins_element++) {
        for (let current_sum = 1; current_sum <= amount; current_sum++) {
            
            subsetsum_table[coins_element][current_sum] = subsetsum_table[coins_element - 1][current_sum];

            if (!subsetsum_table[coins_element][current_sum]) {
                subsetsum_table[coins_element][current_sum] = current_sum - coins[coins_element] < 0 ?
                                                              false : subsetsum_table[coins_element - 1][current_sum - coins[coins_element]];
            }            
        }
    }   
    
    let subset = [];

    // If found solution, we need to recover it.
    if (subsetsum_table[coins.length - 1][amount]) {        
        let current_element_index = coins.length;
        let current_sum_reach = amount;

        // Search for each element if it part of the solution or it inherit from
        // the previous element and add it to the subset solution.
        while (current_sum_reach != 0 && current_element_index != 0) {
            if (!subsetsum_table[current_element_index - 1][current_sum_reach]) {
                subset.push(coins[current_element_index]);
                current_sum_reach -= coins[current_element_index];                
            } 
            current_element_index--;
        }

        // Check if we reach the end and the sum is still not zero, means 
        // The first element is part of the solution and we need to add it.
        if (current_element_index == 0 && current_sum_reach != 0) {
            subset.push(coins[current_element_index]);
        }
    }    

    return subset;
}

function calc() {
    let coins = document.getElementById("coins").value.split(',');
    let coins_arr = [];    
    for (let index = 0; index < coins.length; index++) {
        coins_arr.push(parseInt(coins[index]));
    }
    
    let results = amountToCoins(coins_arr,
                                parseInt(document.getElementById("amount").value));
    
    if (results.length == 0) {
        document.getElementById("results").innerHTML = "Subset Not Found";
    } else {
        document.getElementById("results").innerHTML = results;
    }
    
}