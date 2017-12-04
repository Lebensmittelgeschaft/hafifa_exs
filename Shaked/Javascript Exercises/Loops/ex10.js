window.onload = function() {
    document.getElementById("results").innerHTML = rhombus(100);
}

function rhombus(size) {
    let string_rhombus = "";

    for (let row_index = 0; row_index <= size / 2; row_index++) {
        for (let space_index = size / 2 - row_index;
             space_index > 0;
             space_index--) {
            string_rhombus += "&nbsp;";
        }

        for (let star_count = 0; star_count < row_index; star_count++) {
            string_rhombus += '*';
        }
        string_rhombus += "<br>";
    }

    for (let row_index = size / 2; row_index > 0; row_index--) {
        for (let space_index = 0;
             space_index < (size / 2 - row_index);
             space_index++) {
            string_rhombus += "&nbsp;";
        }

        for (let star_count = 0; star_count < row_index; star_count++) {
            string_rhombus += '*';
        }
        string_rhombus += "<br>";
    }
    return string_rhombus;
    
}