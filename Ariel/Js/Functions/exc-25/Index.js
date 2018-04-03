

var findLongestString = function() {
    var countries = document.querySelector("input").value.split(",");
    
    if (countries[0] == "") {
        alert("Please enter at least one country")
    } else {
        var bigChar = 0;
        var bigCountries = [];
        countries.forEach(function(element) {
            if (element.length == bigChar) {
                bigCountries.push(element);   
            } else if(element.length > bigChar) {
                bigChar = element.length;
                bigCountries = [];
                bigCountries.push(element); 
            }
        });

        alert("The longest country(ies) name: " + bigCountries);
    }  
}