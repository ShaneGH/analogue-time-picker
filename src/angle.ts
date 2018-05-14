const _90 = Math.PI / 2;
const _360 = Math.PI * 2;

function getAngle(
    left: number, 
    top: number,
    width: number, 
    height: number) {

    var x = (width / 2) - left;
    var y = (height / 2) - top;

    // tan O = y / x
    var angle = x ? 
        Math.atan(y / x) : 
        y < 0 ? -_90 : _90;

    if (x < 0) {
        // reflect along vertical axis
        angle = -angle + (2 * (_90 + angle));
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