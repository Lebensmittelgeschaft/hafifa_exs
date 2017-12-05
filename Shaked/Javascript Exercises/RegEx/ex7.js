function isIPAddress(text) {
    return (text.match(/^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/) ? 
            "This is IP Address": "This is'nt IP Address");
}

function checkIP() {
    let check_text = document.getElementById("check_text").value;
    document.getElementById("results").innerHTML = isIPAddress(check_text);
}