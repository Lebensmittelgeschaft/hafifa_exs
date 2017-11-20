// Task number 19

function Arr(array) {
    this.array = array;
    this.length = array.length;
}

Arr.prototype.sumTo = function(secondArray) {
    var newArray = [];
    var commonLength = this.length; 
    if (this.length > secondArray.length) {
        commonLength = secondArray.length;
    }
    for (var i = 0; i < commonLength; i++) {
        newArray.push(Number(this.array[i]) + Number(secondArray.array[i]));
    }
    newArray = newArray.concat(this.array.slice(commonLength, this.length));
    newArray = newArray.concat(secondArray.array.slice(commonLength, secondArray.length));
    return newArray;
};

function sumArrays() {
    var first = document.getElementById("first").value.split(",");
    var second = document.getElementById("second").value.split(",");
    firstArray = new Arr(first);
    secondArray = new Arr(second);
    var result = document.getElementById("newArray");
    result.innerHTML = 'The combibe array is: ' + firstArray.sumTo(secondArray);
}
