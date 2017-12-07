function sort(arr) {
    let temparr = new Array(arr.length);
    for (let i = 0; i < arr.length; i++) {
        arr[i] = parseInt(arr[i]);
    }

    mergesort(arr, temparr, 0, arr.length - 1);
    document.getElementById('result').innerHTML = arr.join(',');
}

function mergesort(arr, temparr, left, right) {
    let mid = parseInt((right + left) / 2);
    if (mid > left) {
        mergesort(arr, temparr, left, mid);
    }

    if (right > mid + 1) {
        mergesort(arr, temparr, mid + 1, right);
    }

    merge(arr, temparr, left, mid, right);
}

function merge(arr, temparr, left, mid, right) {
    let leftplace = left;
    let rightplace = mid + 1;
    let leftover = false;
    let rightover = false;

    for (let place = left; place <= right; place++) {
        if (leftplace > mid) leftover = true;
        if (rightplace > right) rightover = true;
        if (rightover || !leftover && arr[leftplace] <= arr[rightplace]) {
            temparr[place] = arr[leftplace++];
        } else {
            temparr[place] = arr[rightplace++];
        }
    }

    for (let i = left; i <= right; i++) {
        arr[i] = temparr[i];
    }
}