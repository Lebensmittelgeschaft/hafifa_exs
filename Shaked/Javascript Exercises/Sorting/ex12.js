window.onload = function() {
    let unsorted_arr = [3,6,5,2,4,1];
    document.getElementById("presort_array").innerHTML = unsorted_arr;
    flashSort(unsorted_arr);
    document.getElementById("sorted_array").innerHTML = unsorted_arr;
}


function flashSort(arr) {
    let max_index = 0;
    let min_num = arr[0];
    let arr_size = arr.length;
    let class_size = ~~(0.45 * arr_size);
    let class_arr = new Array(class_size);
 
    for (let index = 1; index < arr_size; ++index) {
        if (arr[index] < min_num) {
            min_num = arr[index];
        }
        if (arr[index] > arr[max_index]) {
            max_index = index;
        }
    }
 
     if (min_num === arr[max_index]) {
        return arr;
    }
 
    let class_index = (class_size - 1) / (arr[max_index] - min_num);
 
 
    for (let index = 0; index < class_size; index++) {
        class_arr[index] = 0;
    }
    for (let index = 0; index < arr_size; ++index) {
        let current_index = ~~(class_index * (arr[index] - min_num));
        ++class_arr[current_index];
    }
 
    for (let index = 1; index < class_size; ++index) {
        class_arr[index] += class_arr[index - 1];
    }
 
    let hold = arr[max_index];
    arr[max_index] = arr[0];
    arr[0] = hold;
        
    let move = 0, t, flash;
    j = 0; 
    let class_location = class_size - 1;
  
    while (move < (arr_size - 1)) {
        while (j > (class_arr[class_location] - 1)) {
            ++j;
            class_location = ~~(class_index * (arr[j] - min_num));
        }
        if (class_location < 0) break;
        flash = arr[j];
        while (j !== class_arr[class_location]) {
            class_location = ~~(class_index * (flash - min_num));
            hold = arr[t = --class_arr[class_location]];
            arr[t] = flash;
            flash = hold;
            ++move;
        }
    } 
    
    for (let index = 1; index < arr_size; index++) {
        hold = arr[index];
        let arr_index = index - 1;
        while (arr_index >= 0 && arr[arr_index] > hold) {
            arr[arr_index + 1] = arr[arr_index--];
        }
        arr[arr_index + 1] = hold;
    }
    return arr;
}