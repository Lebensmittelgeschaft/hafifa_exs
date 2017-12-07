function find(str) {
    let freqarray = new Array("z".charCodeAt(0) - "a".charCodeAt(0));
    freqarray.forEach(e => function(e) { e = 0;});

    for (let i = 0; i < str.length; i++) {
        let char = str.charAt(i);
        if (freqarray[String(char).charCodeAt(0)]) {
            freqarray[String(char).charCodeAt(0)]++;
        } else {
            freqarray[String(char).charCodeAt(0)] = 1;
        }
    }

    let foundchar = '';
    for (let i = 0; i < freqarray.length && foundchar === ''; i++) {
        if (freqarray[i] == 1) {
            foundchar = String.fromCharCode(i);
        }
    }

    document.getElementById('result').innerHTML = foundchar;
}