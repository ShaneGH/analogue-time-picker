
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
    x: number, 
    y: number, 
    width: number, 
    height: number,
    fontSize: number | null) {

    var w = width / 2;
    var _x = w - x;
    var _y = (height / 2) - y;

    var distance = Math.sqrt((_x * _x) + (_y * _y));
    var maxPm = w - emToPx(2.5, fontSize);

    return distance > maxPm ? AmPm.am : AmPm.pm;
};

export {
    AmPm,
    getAMPM
}