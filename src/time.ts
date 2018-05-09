import { AmPm } from "./distance";

var one12th = Math.PI / 6;
var one60th = Math.PI / 30;
var _360 = Math.PI * 2;

function snap(angle: number, step: number) {

    var a = angle;
    while (a < 0) a += _360;
    var diff = a % step;

    if (diff <= step / 2) {
        return angle - diff;
    }

    return angle - diff + step;
}

const hourMultiplier = 6 / Math.PI;
function getHours (handAngle: number) {
    handAngle = snap(handAngle, one12th);

    var hour = parseInt(((handAngle / one12th) % 12 - 3).toFixed());
    while (hour <= 0) hour += 12;
    while (hour > 12) hour -= 12;

    return {
        hour,
        handAngle
    }
}

const minuteMultiplier = 30 / Math.PI;
function getMinutes (handAngle: number) {
    handAngle = snap(handAngle, one60th);

    var minute = parseInt(((handAngle / one60th) % 60 - 15).toFixed());
    while (minute < 0) minute += 60;
    while (minute > 60) minute -= 60;
    
    return {
        minute,
        handAngle
    }
}

export {
    getHours,
    getMinutes
}