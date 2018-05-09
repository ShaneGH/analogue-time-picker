const _90 = Math.PI / 2;
const _360 = Math.PI * 2;

function getAngle(
    clientX: number, 
    clientY: number, 
    clockFace: HTMLElement) {

    var width = clockFace.offsetWidth / 2;
    var x = width - clientX;

    var height = clockFace.offsetHeight / 2;
    var y = height - clientY;

    // tan O = y / x
    var angle = x ? Math.atan(y / x) : (Math.PI / 2);
    if (x < 0) {
        angle = -angle + (2 * ((Math.PI / 2) + angle));
    }

    return angle;
}

function getAngleDelta(previous: number, next: number) {
    var diff = next - previous;
    while (diff > Math.PI) {
        diff -= _360;
    }
    
    while (diff < -Math.PI) {
        diff  += _360;
    }

    return diff;
}

export {
    getAngle,
    getAngleDelta
}