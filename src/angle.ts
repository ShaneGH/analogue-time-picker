const _90 = Math.PI / 2;
const _360 = Math.PI * 2;

function getAngle(
    x: number, 
    y: number,
    width: number, 
    height: number) {

    var _x = (width / 2) - x;
    var _y = (height / 2) - y;

    // tan O = y / x
    var angle = _x ? Math.atan(_y / _x) : (Math.PI / 2);
    if (_x < 0) {
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