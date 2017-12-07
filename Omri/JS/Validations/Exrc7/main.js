function isObjJson(value) {
    document.getElementById('result').innerHTML = toString.call(value) === '[object Object]';
}

window.onload = function printIsJson() {
    const OBJ = { author: 'Bill Gates', title: 'The Road Ahead', libraryID: 1254};
    isObjJson(OBJ);
}