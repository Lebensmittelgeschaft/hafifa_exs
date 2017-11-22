//validation ex.10  https://www.w3resource.com/javascript-exercises/validation/index.php


function checkType(obj1, obj2){

    console.log("type1: " + (typeof obj1));
    console.log("type2: " + (typeof obj2));
    console.log((typeof obj1) === typeof(obj2));

    return ((typeof obj1) === typeof(obj2));
}




checkType(25, "hello");
checkType(true, "true");
checkType(5, 67.5);