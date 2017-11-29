var input = prompt("Please enter a string that start with an english letter");

if(input == null) {
    alert("Good bye (-:");
    window.close();
} else {
    while(new RegExp(/^[^a-zA-Z]/).test(input) || input =="") {
        alert("Invalid value");
        input = prompt("Please enter a string that start with an english letter");
    }

    if(new RegExp(/^[a-z]/).test(input)) {
        alert('The string "' + input + '" start with a lowercase letter')
    } else {
        alert('The string "' + input + '"start with an uppercase letter')
    }
}