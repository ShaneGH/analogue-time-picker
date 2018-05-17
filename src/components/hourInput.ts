import { AmPm } from '../utils/distance';
import { convert12hTo24h, convert24hTo12h } from '../utils/time';
import { NumberInput } from './numberInput';

/** An input to manage hours */
class HourInput extends NumberInput {
    getMaxValue() { return 23; }

    private mode: 12 | 24 = 24
    
    /**Set to 12h mode and set am/pm if necessary */
    setTo12Hr(amPm?: AmPm) {
        var value = this.value;
        if (amPm) {
            value = convert12hTo24h(
                convert24hTo12h(value), 
                amPm);
        }

        this.mode = 12;
        this.set(value);
    }

    setTo24Hr() {
        this.mode = 24;
        this.set(this.value);
    }

    /**Convert a 24 hour value into a 12 hour value if necessary */
    transformInputValue(value: number) {
        if (this.mode === 12) {
            if (!value) value = 12;
            else if (value > 12) value -= 12;

            return value.toString();
        }

        return `0${value}`.slice(-2);
    }
}

export {
    HourInput
}