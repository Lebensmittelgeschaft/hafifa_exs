function armstrongNumbers() {
    let armstrong_nums = [];

    for (let digit_one = 1; digit_one < 10; digit_one++) {
        for (let digit_two = 0; digit_two < 10; digit_two++) {
            for (let digit_three = 0; digit_three < 10; digit_three++) {
                if (digit_one ** 3 + digit_two ** 3 + digit_three **3 ==
                    digit_one * 100 + digit_two * 10 + digit_three) {
                        armstrong_nums.push(digit_one * 100 + digit_two * 10 + digit_three);
                }
            }
        }
    }

    return armstrong_nums;
}

function setArmstrongNums() {
    document.getElementById("results").innerHTML = armstrongNumbers();
}