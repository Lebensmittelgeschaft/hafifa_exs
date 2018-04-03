var numbers = [5, 10, 15, 20, 25, 30, 35, 40];

alert("The array is: " + numbers.toString());

var target = parseInt(prompt("Please enter target"));

while(isNaN(target)) {
    alert("Please enter only numbers");
    target = parseInt(prompt("Please enter target"));
}


var findSolution = function (numbers, sum, solution, index, allSolutions) {
    if (sum == 0) {
        allSolutions.push(solution);
        
        return (null);
    }
    else if (sum < 0 || index >= numbers.length) {
        return (null);
    }
    else {
        solution1 = findSolution(numbers, sum - numbers[index], solution.concat([numbers[index]]), index + 1,allSolutions);
        solution2 = findSolution(numbers, sum, solution, index + 1,allSolutions);
        
        return (null);

    }
}

var allVariations = [];
findSolution(numbers, target, [], 0 ,allVariations);

if(allVariations.length == 0 || allVariations[0].length == 0) {
    alert("No match");
} else {
    alert("For see all the variations check log");
}

allVariations.forEach(variations =>{
     console.dir(variations);
});
