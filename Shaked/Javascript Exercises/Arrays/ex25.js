function orderObj() {
    var library = [
        { author: 'Bill Gates', title: 'The Road Ahead', libraryID: 1254 },
        { author: 'Steve Jobs', title: 'Walter Isaacson', libraryID: 4264 },
        { author: 'Suzanne Collins', title: 'Mockingjay: The Final Book of The Hunger Games', libraryID: 3245 }
    ];
    document.getElementById('pre-order').innerHTML = JSON.stringify(library);
    document.getElementById('ordered').innerHTML = JSON.stringify(sortObj(library));
}

function sortObj(objs) {
    return objs.sort((a, b) => a.title.localeCompare(b.title));
}