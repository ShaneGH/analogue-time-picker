import { getAngle } from './angle';
import { Numbers, Position } from './numbers';
import { getMinutes } from './time';

const _90 = Math.PI / 2;
const _6 = Math.PI / 30;
class Minutes extends Numbers {
    /** Get the minute, angle, etc... based on the mouse position */
    getValuesFromPosition(x: number, y: number) {
        var angle = getAngle(x, y, this.elements.containerElement.offsetWidth, this.elements.containerElement.offsetHeight);
        var value = getMinutes(angle);

        return {
            angle: value.handAngle,
            value: value.minute,
            position: Position.far
        }
    }

    /** Returns a label. The label is for accessability/screen reading purposes */
    getLabel() { return "Minutes"; }
    
    /** Get the minute, angle, etc... based on the minute */
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