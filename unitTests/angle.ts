
const _90 = Math.PI / 2;
const _360 = Math.PI * 2;

function getAngle(clientX: number, clientY: number, clock: HTMLElement) {
    var width = clock.offsetWidth / 2;
    var positionX = clientX - clock.offsetLeft;
    var x = width - positionX;

    var height = clock.offsetHeight / 2;
    var positionY = clientY - clock.offsetTop;
    var y = height - positionY;

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