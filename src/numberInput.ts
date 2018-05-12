import { registerKeyEvent } from "./utils";


function increase(val: string, max: number) {
    var v = parseInt(val) + 1;
    return  v > max ? 0 : v;
}

function decrease(val: string, max: number) {
    var v = parseInt(val) - 1;
    return v < 0 ? max : v;
}

function getElementNewValues(element: HTMLInputElement, key: string, max: number) {
    var actualStart = element.selectionStart || 0;
    var start = actualStart > 1 ? 
        1 : 
        actualStart ;

    var val1 = (element.value || "").substr(0, start);
    var val2 = (element.value || "").substr(start + 1);

    var value = parseInt(`${val1}${key}${val2}`);
    if (value < 0 || value > max) return null;

    return {
        value,
        position: actualStart + 1,
        characterReplaced: actualStart ? 2 : 1
    };
}

var numberKey = /^\d$/;
var fKey = /^F\d+$/;
function keyPressDetails(element: HTMLInputElement, e: KeyboardEvent, max: number) {

    var handled = true;
    switch (e.key) {
        case "ArrowUp":
            return {
                handled: true,
                value: increase(element.value, max),
                position: null,
                characterReplaced: null
            };
        case "ArrowDown":
            return {
                handled: true,
                value: decrease(element.value, max),
                position: null,
                characterReplaced: null
            };
        case "ArrowRight":
        case "ArrowLeft":
        case "Tab":
            return {
                handled: false
            };
        default:
            if (numberKey.test(e.key)) {
                return {
                    handled: true,
                    ...getElementNewValues(element, e.key, max)
                };
            } else if (fKey.test(e.key)) {
                return {
                    handled: false
                };
            }
    }
    
    return { handled: true };
}

abstract class NumberInput {

    _keyPressHandler: () => void
    constructor(public input: HTMLInputElement) {
        this._keyPressHandler = registerKeyEvent(input, "keydown", e => this.onKeyDown(e));
    }

    _onNextCallbacks: (() => void)[] = []
    onNext(f: () => void) {
        this._onNextCallbacks.push(f);
    }

    protected abstract getMaxValue(): number

    onKeyDown(e: KeyboardEvent) {
        var details = keyPressDetails(this.input, e, this.getMaxValue());
        
        if (details.handled) e.preventDefault();
        if (details.value != null) {
            this._set(details.value);
        }

        if (details.position) {
            this.input.selectionEnd = details.position;
            this.input.selectionStart = details.position;
            if (details.position > 1) {
                this._onNextCallbacks.forEach(f => f());
            }
        }
    }

    set(value: number) {
        if (value < 0 || value > this.getMaxValue()) throw new Error(`Invalid value "${value}"`);
        this._set(parseInt(value.toFixed()));
    }

    _set(value: number) {
        this.input.value = `0${value}`.slice(-2);
    }
    
    _timeChangedCallbacks: ((hours: number, minutes: number) => void)[] = [];
    onTimeChanged(callback: ((hours: number, minutes: number) => void)) {
        this._timeChangedCallbacks.push(callback);
    }

    focus() {
        this.input.focus();
        this.input.selectionStart = 0;
        this.input.selectionEnd = 0;
    }

    dispose() {
        this._keyPressHandler();
        
        this._onNextCallbacks = [];
        this._timeChangedCallbacks = [];
    }
}

class HourInput extends NumberInput {
    getMaxValue() { return 23; }
}

class MinuteInput extends NumberInput {
    getMaxValue() { return 59; }
}

export {
    HourInput,
    MinuteInput,
    NumberInput
}