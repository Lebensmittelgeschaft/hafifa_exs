function hours_diff(first_date, second_date) {
    return (Math.abs((first_date.getTime() - second_date.getTime()) / (1000 * 60 * 60)));
}

function hoursDiff() {
    document.getElementById("results").innerHTML = 
                    hours_diff(new Date(document.getElementById("first-date").value),
                               new Date(document.getElementById("second-date").value));
}

