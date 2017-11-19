//objects ex.9  https://www.w3resource.com/javascript-exercises/javascript-object-exercises.php


function calculate(){

        let radius = document.getElementById("radius").value;

        console.log(radius);

        document.getElementById("volume").innerHTML = "perimeter: " + perimeter(radius) + " area: " + area(radius);
        // pow(radius,3)

}

function perimeter(radius){
        return (2*Math.PI*radius);

}

function area(radius){
        return (Math.pow(radius,2)*Math.PI);

}