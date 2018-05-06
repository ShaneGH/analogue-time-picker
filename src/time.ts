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
function getHours (handAngle: number, amPm: AmPm) {
    handAngle = snap(handAngle, one12th);

    var hour = parseInt(((hourMultiplier * handAngle) + 9).toFixed(0));
    if (hour > 12) hour -= 12;
    
    return {
        hour,
        handAngle,
        amPm
    }
}

const minuteMultiplier = 30 / Math.PI;
function getMinutes (handAngle: number) {
    handAngle = snap(handAngle, one60th);

    var minute = parseInt(((minuteMultiplier * handAngle) + 45).toFixed(0));
    if (minute >= 60) minute -= 60;
    
    return {
        minute,
        handAngle
    }
}

export {
    getHours,
    getMinutes
}