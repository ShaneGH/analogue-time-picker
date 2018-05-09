import { Numbers, Position } from "./numbers";
import { getAngle } from "./angle";
import { getMinutes } from "./time";

const _90 = Math.PI / 2;
const _6 = Math.PI / 30;
class Minutes extends Numbers {
    getValuesFromPosition(x: number, y: number) {
        var angle = getAngle(x, y, this.containerElement.offsetWidth, this.containerElement.offsetHeight);
        var value = getMinutes(angle);

        return {
            angle: value.handAngle,
            value: value.minute,
            position: Position.far
        }
    }
    
    getValuesFromValue(value: number) {
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