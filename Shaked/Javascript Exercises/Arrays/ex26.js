/* This solution solve the problem in O(arr.length * amount) time complexity */
function sumInArray(arr, amount) {
    // Base cases if theres only one or two elements in arr
    if (arr.length == 1) {
        return (arr[0] == amount ? arr : []);
    } else if (arr.length == 2) {
        return (arr[0] + arr[1] == amount ? arr : []);
    }

    // Create table of boolean values indicates the sums from 0 to amount
    // We can create from the arr
    let subsetsum_table = Array(arr.length);

    // Create the array with size of the amount for determine if the sum can create
    // With each element in the array.
    // Also set all the sums of zero to true because we can acquire them without any number;
    for (let index = 0; index < arr.length; index++) {
        subsetsum_table[index] = Array(amount + 1);
        subsetsum_table[index][0] = true;
    }

    for (let current_sum = 1; current_sum <= amount; current_sum++) {
        subsetsum_table[0][current_sum] = false;
    }

    // Check if the first element in the arr is considered in the sums range.
    // If so, we need to count this as true because it can be acquired by the first element.
    if (arr[0] <= amount) {
        subsetsum_table[0][arr[0]] = true;
    }

    // Navigating through all the elements and finding if the sum can be acquire by
    // each element, considered by previous elements choices if the sum is bigger than
    // actual sum.
    for (let arr_element = 1; arr_element < arr.length; arr_element++) {
        for (let current_sum = 1; current_sum <= amount; current_sum++) {

            subsetsum_table[arr_element][current_sum] = subsetsum_table[arr_element - 1][current_sum];

            if (!subsetsum_table[arr_element][current_sum]) {
                subsetsum_table[arr_element][current_sum] = current_sum - arr[arr_element] < 0 ?
                    false : subsetsum_table[arr_element - 1][current_sum - arr[arr_element]];
            }
        }
    }

    let subsets = [];

    // If found solution, we need to recover it.
    if (subsetsum_table[arr.length - 1][amount]) {

        // Search for each element if it part of subset solution and recover all the possible solutions.
        for (let element_index = arr.length - 1; element_index >= 0; element_index--) {
            let current_sum_reach = amount;
            let next_element_solution_index = element_index;
            let new_subset = [];

            // Check if the current element is part of the solution.
            if (subsetsum_table[next_element_solution_index][current_sum_reach] &&
                current_sum_reach - arr[next_element_solution_index] >= 0) {

                // Check for another elements that can be part of the current solution.
                while (current_sum_reach != 0 && next_element_solution_index > 0) {
                    if (subsetsum_table[next_element_solution_index][current_sum_reach] &&
                        current_sum_reach - arr[next_element_solution_index] >= 0) {
                        new_subset.push(arr[next_element_solution_index]);
                        current_sum_reach -= arr[next_element_solution_index];
                    }
                    next_element_solution_index--;
                }

                // Check if the first element is the solution.
                if (current_sum_reach != 0 && next_element_solution_index == 0) {
                    new_subset.push(arr[next_element_solution_index]);
                }

                // If found subset than need to add it.
                if (new_subset.length != 0) {
                    subsets.push(new_subset);
                }
            }
        }
    }

    return subsets;
}

function findSum() {
    let arr_input = document.getElementById("arr_set").value.split(',');
    let arr_translated = [];
    for (let index = 0; index < arr_input.length; index++) {
        arr_translated.push(parseInt(arr_input[index]));
    }

    let results = sumInArray(arr_translated,
        parseInt(document.getElementById("sum").value));

    if (results.length == 0) {
        document.getElementById("results").innerHTML = "Subset Not Found";
    } else {
        document.getElementById("results").innerHTML = JSON.stringify(results);
    }
}