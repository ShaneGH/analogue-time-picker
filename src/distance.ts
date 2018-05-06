
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

function getAMPM(clientX: number, clientY: number, clock: HTMLElement) {
    var width = clock.offsetWidth / 2;
    var positionX = clientX - clock.offsetLeft;
    var x = width - positionX;

    var height = clock.offsetHeight / 2;
    var positionY = clientY - clock.offsetTop;
    var y = height - positionY;

    var distance = Math.sqrt((x * x) + (y * y));
    var maxPm = width - emToPx(2.5, clock);

    return distance > maxPm ? AmPm.am : AmPm.pm;
};

export {
    AmPm,
    getAMPM
}