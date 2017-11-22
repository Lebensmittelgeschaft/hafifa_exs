//sorting ex.7: bubbleSort  https://www.w3resource.com/javascript-exercises/searching-and-sorting-algorithm/index.php


function bubbleSort(array){

    console.log("array before: " + array);
    for(let i = 0 ; i < array.length ; i++){
        for(let j = i+1 ; j < array.length ; j++){
            if(array[i] > array[j]){
                array = swap(array, i, j);
            }
        }
        //console.log(array);
    }
    console.log("array after: " + array);


}


function swap(array, i, j){
    //console.log("b:" + array);
    let temp = array[j];
    array[j] = array[i];
    array[i] = temp;
    //console.log("a:" + array);
    return array;

}


bubbleSort([1,2,3,4,5,6,7,8]);
bubbleSort([8,7,6,5,4,3,2,1]);
bubbleSort([4,5,8,2,6,3,1,7]);
bubbleSort(["abc","cba","bca","bac"]);