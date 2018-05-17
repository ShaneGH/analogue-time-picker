import { NumberInput } from "./numberInput";

/** A numner input for mintes */
class MinuteInput extends NumberInput {
    getMaxValue() { return 59; }
    transformInputValue(value: number) {
        return `0${value}`.slice(-2);
    }
}

export {
    MinuteInput
}