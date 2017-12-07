function armstrong() {
    let armstrongnumbers = [];
    for (let i = 100; i <= 999; i++) {
        let sum = parseInt((i + "").split('')[0])**3 + parseInt((i + "").split('')[1])**3 + parseInt((i + "").split('')[2])**3;
        if(i == sum) {
            armstrongnumbers.push(i);
        }
    }

    document.getElementById('result').innerHTML = armstrongnumbers.join(',');
}