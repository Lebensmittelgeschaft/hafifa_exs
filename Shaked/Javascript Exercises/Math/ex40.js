function randomBackground() {
    document.body.style.background =
                            "rgb(" + ((Math.random() * 255) + 1)  +
                            "," + ((Math.random() * 255) + 1) +
                            "," + ((Math.random() * 255) + 1) + ")";
}