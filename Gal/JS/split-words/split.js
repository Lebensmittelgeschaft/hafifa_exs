// Task number 3

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

function split() {
    var newString = "";
    var str = document.getElementById("words").value.split(" ");
    var result = document.getElementById("newStrings");
    for (var i = 0; i < str.length; i++) {
        newString += str[i] + ",";
    }
    console.log(str);
    console.log(newString);
    result.innerHTML = 'The words are: [' + newString.substr(0,newString.length-1) + ']';
}
