function sort(arr) {
    for (let i = 0; i < arr.length; i++) {
        arr[i] = parseInt(arr[i]);
    }

    var max = 0, min = arr[0];
    var n = arr.length;
    var m = ~~(0.45 * n);
    var l = new Array(m);

    for (var i = 1; i < n; ++i) {
        if (arr[i] < min) {
            min = arr[i];
        }
        if (arr[i] > arr[max]) {
            max = i;
        }
    }

    if (min === arr[max]) {
        return arr;
    }

    var c1 = (m - 1) / (arr[max] - min);


    for (var k = 0; k < m; k++) {
        l[k] = 0;
    }
    for (var j = 0; j < n; ++j) {
        k = ~~(c1 * (arr[j] - min));
        ++l[k];
    }

    for (var p = 1; p < m; ++p) {
        l[p] = l[p] + l[p - 1];
    }

    var hold = arr[max];
    arr[max] = arr[0];
    arr[0] = hold;

    //permutation
    var move = 0, t, flash;
    j = 0; 
    k = m - 1;

    while (move < (n - 1)) {
        while (j > (l[k] - 1)) {
            ++j;
            k = ~~(c1 * (arr[j] - min));
        }
        if (k < 0) break;
        flash = arr[j];
        while (j !== l[k]) {
            k = ~~(c1 * (flash - min));
            hold = arr[t = --l[k]];
            arr[t] = flash;
            flash = hold;
            ++move;
        }
    }

    //insertion
    for (j = 1; j < n; j++) {
        hold = arr[j];
        i = j - 1;
        while (i >= 0 && arr[i] > hold) {
            arr[i + 1] = arr[i--];
        }
        arr[i + 1] = hold;
    }

    document.getElementById('result').innerHTML = arr.join(',');
}