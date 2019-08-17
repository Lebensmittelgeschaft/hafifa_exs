function isFirstLetterUppercase(text) {
     return ((text.match(/^[A-Z]/)) ?
             "First Letter Is Uppercase" : "First Letter Is'nt Uppercase");
}

function checkUppercase() {
    let check_text = document.getElementById("check_text").value;
    document.getElementById("results").innerHTML = isFirstLetterUppercase(check_text);
            
}