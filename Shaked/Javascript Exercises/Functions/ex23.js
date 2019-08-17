function findNotRepeated(string) {

    let first_repeat = [];

    let many_repeat = [];

    for (let letter of string) {
        if (many_repeat.indexOf(letter) != -1) {
            continue;
        }
        let index = first_repeat.indexOf(letter);
        if (index == -1) {
            first_repeat.push(letter);
        } else {
            first_repeat.splice(index, 1);
            many_repeat.push(letter);
        }
    }

    if (first_repeat.length == 0) {
        return "No Such Letter";
    } else {
        return first_repeat[0];
    }

}

function findLetter() {
    let characters = document.getElementById("characters").value;
    document.getElementById("results").innerHTML = findNotRepeated(characters);
}