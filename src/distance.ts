
enum AmPm {
    am = "am",
    pm = "pm"
}

function emToPx(em: number, clock: HTMLElement) {
    return parseFloat(
        window.getComputedStyle(clock).fontSize || 
        window.getComputedStyle(document.body).fontSize || 
        "12") * em;
}

function getAMPM(
    clientX: number, 
    clientY: number, 
    clockFace: HTMLElement) {

    var width = clockFace.offsetWidth / 2;
    var x = width - clientX;

    var height = clockFace.offsetHeight / 2;
    var y = height - clientY;

    var distance = Math.sqrt((x * x) + (y * y));
    var maxPm = width - emToPx(2.5, clockFace);

    return distance > maxPm ? AmPm.am : AmPm.pm;
};

export {
    AmPm,
    getAMPM
}