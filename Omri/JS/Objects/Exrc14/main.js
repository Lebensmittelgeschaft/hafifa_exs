function getObjProps(obj) {
    let props = [];
    for (let prop in obj) {
        props.push(obj[prop]);
    }

    document.getElementById('result').innerHTML = props.join(', ');
}

window.onload = function printObj() {
    const OBJ = { author: 'Bill Gates', title: 'The Road Ahead', libraryID: 1254};
    getObjProps(OBJ);
}