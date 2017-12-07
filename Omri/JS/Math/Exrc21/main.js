const ROMAN_NUMERALS = [
    {num: 1, roman: 'I'},
    {num: 4, roman: 'IV'},
    {num: 5, roman: 'V'},
    {num: 9, roman: 'IX'},
    {num: 10, roman: 'X'},
    {num: 40, roman: 'XL'},
    {num: 50, roman: 'L'},
    {num: 90, roman: 'XC'},
    {num: 100, roman: 'C'},
    {num: 400, roman: 'CD'},
    {num: 500, roman: 'D'},
    {num: 900, roman: 'CM'},
    {num: 1000, roman: 'M'}
];

function toroman(num) {
    let romannum = "";
    for (let i = ROMAN_NUMERALS.length - 1; i >= 0; i--) {
        while (ROMAN_NUMERALS[i].num <= num) {
            romannum += ROMAN_NUMERALS[i].roman;
            num -= ROMAN_NUMERALS[i].num;
        }
    }

    document.getElementById('result').innerHTML = romannum;
}