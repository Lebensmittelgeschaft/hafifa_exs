//dom ex.9  https://www.w3resource.com/javascript-exercises/javascript-dom-exercises.php


function calculate(){

        let radius = document.getElementById("radius").value;

        console.log(radius);

        document.getElementById("volume").innerHTML = Math.pow(radius,3)*(4/3)*Math.PI;
        // pow(radius,3)

}