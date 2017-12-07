function hoursdiff(d1, d2) {
    let dearly = new Date(d1);
    let dlate = new Date(d2);
    document.getElementById('result').innerHTML = ((dlate.getTime() - dearly.getTime()) / (1000 * 60 * 60)) + " Hours";
}