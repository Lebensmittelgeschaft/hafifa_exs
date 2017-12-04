function calculate(operation) {

    let results = undefined;
    let error_message = "Invalid Operation";
    let first_var = Number(document.getElementById("first_var").value);
    let second_var = Number(document.getElementById("second_var").value);

    if (isNaN(first_var) || isNaN(second_var)) {
        error_message = "Invalid Input";
    } else if (operation == '*' ) {
        results = first_var * second_var;        
    } else if (operation == '/') {
        results = first_var / second_var;        
    } else if (operation == '+') {
        results = first_var + second_var;
    } else if (operation == '-') {
        results = first_var - second_var;
    }

    var results_div = document.getElementById("results");
    if (results == undefined) {        
        results_div.innerHTML = error_message;
    } else {
        results_div.innerHTML = `${first_var} ${operation} ${second_var} = ${results}`;
    }
    
}