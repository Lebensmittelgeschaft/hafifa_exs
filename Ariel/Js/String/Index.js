var sentence = "<p><strong><em>PHP Exercises</em></strong></p>";
alert("The full sentence is: " + sentence);

 //------------------------ FIRST WAY -----------------------
var div = document.createElement("div");
div.innerHTML = sentence;
alert("Result: " + div.innerText);

// ------------------------ SECOND WAY -----------------------
// var reg = /<\/?[^>]+(>|$)/g;
// alert("Result: " + sentence.replace(reg, ""));