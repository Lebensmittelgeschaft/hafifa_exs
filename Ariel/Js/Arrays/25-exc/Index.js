var library = [ 
    { author: 'Bill Gates', title: 'The Road Ahead', libraryID: 1254},
    { author: 'Steve Jobs', title: 'Walter Isaacson', libraryID: 4264},
    { author: 'Suzanne Collins', title: 'Mockingjay: The Final Book of The Hunger Games', libraryID: 3245}
];

alert("See logs");
console.log("library before sort:");
console.log(JSON.stringify(library));


 
library.sort(function(firstObj, secondObj) {
    return (firstObj.title.toLowerCase().localeCompare(secondObj.title.toLowerCase()));
});

console.log("library after sort:");
console.log(JSON.stringify(library));
