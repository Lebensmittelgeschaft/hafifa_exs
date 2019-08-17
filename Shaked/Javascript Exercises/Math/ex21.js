function intToRoman(num) {
    let romanTable = {
        "M": 1000,
        "CM": 900,
        "D": 500,
        "C": 100,
        "LX": 60,
        "L": 50,
        "XL": 40,
        "X": 10,
        "IX": 9,
        "V": 5,
        "IV": 4,
        "I": 1
    };

    let roman_result = "";

    for (let roman_letter in romanTable) {
        while (num >= romanTable[roman_letter]) {
            roman_result += roman_letter;
            num -= romanTable[roman_letter];
        }
    }

    return roman_result;
}

function convertIntToRoman() {
    let number = document.getElementById("num_conv").value;
    document.getElementById("results").innerHTML = intToRoman(number);
}