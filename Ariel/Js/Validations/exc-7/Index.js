var findType = function(obj) {
    var type = Object.prototype.toString.call(obj);

    if (type === '[object Null]') {
        return "Null";
    } else if (type === '[object Undefined]') {
        return "Undefined";
    } else if (type === '[object String]') {
        return "String";
    } else if (type === '[object Array]') {
        return "Array";
    } else if (type === '[object Object]') {
        return "JSON";
    } else if(type === '[object Number]') {
        return "Number";
    } else if (type === '[object Function]') {
        return "Function";
    } else {
        return "Else";
    }
}

var presentLogs = function(obj) {
    console.log("The variable is:", obj);
    console.log("Its type is - " + findType(obj));
}

alert("See log");

const jsonObj = {
    name: 'Robert',
    age: 23,
    isSmart: false
};
const arrayObj = ['Robert', 23, false];
const strObj = "Robert";
const numObj = 8;
const nullObj = null;
const undefinedObj = undefined;
const funObj = function() {

};

presentLogs(jsonObj);
presentLogs(arrayObj);
presentLogs(strObj);
presentLogs(numObj);
presentLogs(nullObj);
presentLogs(undefinedObj);
presentLogs(funObj);