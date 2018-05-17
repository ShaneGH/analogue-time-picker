const _90 = Math.PI / 2;
const _360 = Math.PI * 2;

/** Get the angle of the left/top co-ordinate from the center of the width.height box */
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

/** Calculate the smallest difference between 2 angles. e.g. 90° is smaller than 450° */
function getAngleDelta(a1: number, a2: number) {
    var diff = a2 - a1;
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