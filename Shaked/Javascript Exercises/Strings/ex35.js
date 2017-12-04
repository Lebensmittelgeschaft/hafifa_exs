function stripHtml(text) {
    
    let text_temp = text.split("");

    while (text_temp.indexOf('<') != -1)  {
        let first_tag = text_temp.indexOf('<');
        let second_tag = text_temp.indexOf('>');
        text_temp.splice(first_tag, second_tag - first_tag + 1);
    }

    return text_temp.join("");
}

function stripHtmlFromText() {
    let text_to_strip = document.getElementById("text_to_strip").value;
    document.getElementById("results").innerHTML = stripHtml(text_to_strip);
}