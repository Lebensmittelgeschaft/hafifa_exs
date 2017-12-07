function fib(n) {
    if (n == 0) {
        return 0;
    } else if (n == 1) {
        return 1;
    } else {
        return fib(n - 1) + fib(n - 2);
    }
}

function fibonacci(n) {
    let fibseq = [];
    for (let i = n - 1; i >= 0; i--) {
        fibseq.push(fib(i));
    }

    document.getElementById('result').innerHTML = fibseq.reverse().join(', ');
}