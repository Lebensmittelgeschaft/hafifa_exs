var removecolor = function() {
    var select = document.getElementById("colorSelect");
    var currOption = select.selectedIndex;
    alert(select.value + " deleted");
    select.remove(select.selectedIndex);
}