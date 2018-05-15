import { Numbers, Position } from "./numbers";
import { getAngle } from "./angle";
import { getMinutes } from "./time";

declare var XXX: number[];
if (!(<any>window).XXX)(<any>window).XXX = [];

const _90 = Math.PI / 2;
const _6 = Math.PI / 30;
class Minutes extends Numbers {
    getValuesFromPosition(x: number, y: number) {
        XXX.push(55);
        var angle = getAngle(x, y, this.elements.containerElement.offsetWidth, this.elements.containerElement.offsetHeight);
        var value = getMinutes(angle);

        return {
            angle: value.handAngle,
            value: value.minute,
            position: Position.far
        }
    }

    getLabel() { return "Minutes"; }
    
    getValuesFromValue(value: number) {
        XXX.push(56);
        value = parseInt(value.toFixed()) % 60;
        var angle = (value * _6) + _90;

        return {
            angle: angle,
            value: value,
            position: Position.far
        }
    }
}

export {
    Minutes
}