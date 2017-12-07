function strip(str) {
    let strarray = str.split('');
    let strtemp = new String(str);
    let startindex, endindex;
    while((startindex = strtemp.indexOf("<")) != -1 && (endindex = strtemp.indexOf(">")) != -1) {
        strarray.splice(startindex, endindex - startindex + 1);
        strtemp = strarray.join('');
    }

    document.getElementById('result').innerHTML = strtemp;
}