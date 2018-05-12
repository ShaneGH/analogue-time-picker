import { getAngle } from "./angle";
import { Numbers, Position } from "./numbers";
import { getAMPM, AmPm } from "./distance";
import { getHours } from "./time";

const _90 = Math.PI / 2;
const _30 = Math.PI / 6;

class Hours extends Numbers {
    getValuesFromPosition(x: number, y: number) {
        var angle = getAngle(x, y, this.elements.containerElement.offsetWidth, this.elements.containerElement.offsetHeight);
        var amPm = getAMPM(x, y, this.elements.containerElement.offsetWidth, this.elements.containerElement.offsetHeight, this.fontSize);
        var value = getHours(angle, amPm);

        return {
            angle: value.handAngle,
            value: value.hour,
            position: amPm === AmPm.am ? Position.far : Position.near
        }
    }
    
    getValuesFromValue(value: number) {
        value = parseInt(value.toFixed()) % 24;
        var angle = (value * _30) + _90;
        
        return {
            angle: angle,
            value: value,
            position: value && value <= 12 ? Position.far : Position.near
        }
    }
}

export {
    Hours
}