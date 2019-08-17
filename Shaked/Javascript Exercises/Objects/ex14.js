window.onload = function () {
    let obj_test = {"A": "value1", 3: "value2", "asdw": "value3"};
    document.getElementById("sample_object").innerHTML = JSON.stringify(obj_test);
    document.getElementById("object_props").innerHTML = getObjectValues(obj_test);
}

function getObjectValues(obj) {
    let values = [];
    for (let key in obj) {
        values.push(obj[key]);
    }
    return values;
}