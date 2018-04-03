firstDate =  new Date("October 13, 2014 08:11:00"); 
secondDate = new Date("October 13, 2014 11:13:00");

alert("First date: " + firstDate + "\nSecond date: " + secondDate);
var diffHours = Math.abs((firstDate - secondDate) / 1000 / 60 / 60).toFixed(2);
alert("the difference between the first date to the second date in hours is: " + diffHours);