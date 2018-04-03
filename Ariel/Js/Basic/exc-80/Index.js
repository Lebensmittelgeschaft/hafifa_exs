
var isValued = false;
var input = "";
var intArray = [];

while(!isValued) {
    input = prompt("Please insert an array of integer numbers (Split by ',')");
    
    if(input == null) {
        alert("Good bye (-:");
        window.close();
        
        break;
    } 
    
    intArray = input.split(",")

    if(intArray == "") {
        alert("Please enter at least one integer number: ");
        
    } else {
        for(var index = 0; index < intArray.length; index++) {
            if(isNaN(intArray[index])) {
                alert("Please enter only integer numbers (Numerical values, Split by ',')");
                
                break;    
            } 

            var intValue = parseInt(intArray[index]);
            var floatValue = parseFloat(intArray[index]);
            var stringValue = intValue.toString();
                
            if(intValue != floatValue) {
                alert("Please enter only integer numbers (Not Decimal numbers)");
                    
                break; 
            }

            isValued = true;
        }
    }
    
    [intArray[0], intArray[intArray.length - 1]] = [intArray[intArray.length - 1], intArray[0]]
    alert("The array after the swap is: " + intArray);
}