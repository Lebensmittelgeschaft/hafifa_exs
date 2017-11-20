// Task number 11

function validate(temp_value, temp_type) {
    if (!temp_type[0].checked && !temp_type[1].checked) {
        alert("You have to choose a temperature type!");
        return false;
    }
    if (isNaN(temp_value) || temp_value === "") {
        alert("You have to enter a valid number for temperature!");
        return false;
    }
    return true;

}

function calculate(type, temp_value) {
    if (type === 'Celsius') {
        return (5 * (temp_value - 32) / 9);
    }
    else return ((9 * temp_value / 5) + 32);
}

function getCheckedRadioButton(temp_type) {
    var length = temp_type.length;
    for (var i = 0; i < length; i++) {
        if (temp_type[i].checked) {
            return temp_type[i].value;
        }
    }
}

function convert() {
    var temp_value = document.getElementById("c-temp").value;
    var temp_type = document.getElementsByName("temp");
    type = getCheckedRadioButton(temp_type);
    console.log(type);
    if (validate(temp_value, temp_type)) {
        console.log(calculate(type, temp_value));
        console.log(temp_value.checked);
        alert(calculate(type, temp_value) + ' ' + type);
    }
}
