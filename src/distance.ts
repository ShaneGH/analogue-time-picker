
enum AmPm {
    am = "am",
    pm = "pm"
}

function emToPx(em: number, fontSize: number | null) {
    return (fontSize ||
        parseFloat(
            window.getComputedStyle(document.body).fontSize || 
            "12")) * em;
}

function getAMPM(
    left: number, 
    top: number, 
    width: number, 
    height: number,
    fontSize: number | null) {

    var w = width / 2;
    var x = w - left;
    var y = (height / 2) - top;

    var distance = Math.sqrt((x * x) + (y * y));
    var maxPm = w - emToPx(2.5, fontSize);

    return distance > maxPm ? AmPm.am : AmPm.pm;
};

export {
    AmPm,
    getAMPM
}