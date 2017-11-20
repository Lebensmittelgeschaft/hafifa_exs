// Task number 9

function getLastDay() {
    var year = document.getElementById("year").value;
    var month = document.getElementById("month").value;
    // the month is already the next month (the user choose from 1-12 instead of 0-11)
    var lastDay = new Date(year, month, 0);
    var result = document.getElementById("newDate");
    result.innerHTML = 'The last day is: ' + lastDay;
}
