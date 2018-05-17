
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

/** With a 24 hour clock box (width/height) and a mouse position (left/top), 
 * determine whether the use is pointing at an AM hour or a PM hour */
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
    var maxPm = w - emToPx(2.45, fontSize);

    return distance > maxPm ? AmPm.am : AmPm.pm;
};

export {
    AmPm,
    getAMPM
}