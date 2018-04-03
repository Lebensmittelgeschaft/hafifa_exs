var arrnMarks = [];
arrnMarks = document.querySelectorAll("tbody tr td:last-child");
var nSum = 0;

arrnMarks.forEach(element => {
    nSum += parseInt(element.textContent);
});

var nAvg = nSum / arrnMarks.length;
var cGrade;

if(nAvg < 60) {
    cGrade = "F";
} else if(nAvg < 70) {
    cGrade = "D";
} else if(nAvg < 80) {
    cGrade = "C";
} else if(nAvg < 90) {
    cGrade = "B";
} else if(nAvg < 100) {
    cGrade = "A";
} else {
    cGrade = "A++";
}

// var nSum = arrnMarks.reduce(function(tFirstTd, tSecondTd) {
//     return (parseInt(tFirstTd.textContent) + parseInt(tSecondTd.textContent));
// });

alert("The average of the class is " + cGrade);