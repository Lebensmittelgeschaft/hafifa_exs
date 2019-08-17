window.onload = function () {
    let json_sample = {'b': 4, 'c': 5};
    document.getElementById("sample_json").innerHTML = JSON.stringify(json_sample);
    document.getElementById("results").innerHTML = isJson(json_sample);
    let json_sample2 = false;
    document.getElementById("sample_json2").innerHTML = json_sample2;
    document.getElementById("results2").innerHTML = isJson(json_sample2);
}

function isJson(obj)  {
    return obj === Object(obj);
}

