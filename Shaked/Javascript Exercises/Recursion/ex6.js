function fib(fib_count) {
  if (fib_count == 1) 
  {
    return [0, 1];
  } 
  else 
  {
    var fib_numbers = fib(fib_count - 1);
    fib_numbers.push(fib_numbers[fib_numbers.length - 1] +
                     fib_numbers[fib_numbers.length - 2]);
    return fib_numbers;
  }
}

function fibonacci() {
    let fib_count = parseInt(document.getElementById("fib_count").value);     
    if (isNaN(fib_count)) {
        document.getElementById("results").innerHTML = "Invalid Input";
    } else {
        document.getElementById("results").innerHTML = fib(fib_count);
    }
    
}