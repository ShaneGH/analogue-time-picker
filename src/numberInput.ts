import { registerKeyEvent } from './utils';


declare var XXX: number[];
if (!(<any>window).XXX)(<any>window).XXX = [];

function increase(val: string, max: number) {
    XXX.push(36);
    var v = parseInt(val) + 1;
    return  v > max ? 0 : v;
}

function decrease(val: string, max: number) {
    XXX.push(37);
    var v = parseInt(val) - 1;
    return v < 0 ? max : v;
}

function getNewElementValues(element: HTMLInputElement, key: string, max: number) {
    XXX.push(38);

    var actualStart = element.selectionStart || 0;
    var start = actualStart > 1 ? 
        1 : 
        actualStart ;

    var val1 = (element.value || "").substr(0, start);
    var val2 = (element.value || "").substr(start + 1);

    var value = parseInt(`${val1}${key}${val2}`);
    if (value < 0)  return null;

    if (value > max) {
        if (!actualStart) {
            // set last digit to 0 and try again
            value -= value % 10;
            if (value > max) return null;
        }
    }

    return {
        value,
        nextPosition: actualStart + 1
    };
}

type KeyPressDetailsValues =
    {
        handled?: boolean
        value?: number
        nextPosition?: number
    }

var numberKey = /^\d$/;
var fKey = /^F\d+$/;
function keyPressDetails(element: HTMLInputElement, e: KeyboardEvent, max: number): KeyPressDetailsValues {
    XXX.push(39);

    var handled = true;
    switch (e.key) {
        case "ArrowUp":
            return {
                handled: true,
                value: increase(element.value, max)
            };
        case "ArrowDown":
            return {
                handled: true,
                value: decrease(element.value, max)
            };
        case "ArrowRight":
            var nextPosition = (element.selectionStart || 0) + 1;
            return {
                handled: nextPosition > 2,
                nextPosition: nextPosition > 2 ? nextPosition : undefined
            };
        case "ArrowLeft":
            var nextPosition = (element.selectionStart || 0) - 1;
            return {
                handled: nextPosition < 0,
                nextPosition: nextPosition < 0 ? nextPosition : undefined
            };
        case "Tab":
            return {
                handled: false
            };
        default:
            if (numberKey.test(e.key)) {
                return {
                    handled: true,
                    ...getNewElementValues(element, e.key, max)
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
    _focusHandler: () => void
    constructor(public input: HTMLInputElement) {
        this._keyPressHandler = registerKeyEvent(input, "keydown", e => this.keyDown(e));
        this._focusHandler = registerKeyEvent(input, "focus", e => this.focusOnInput());
    }

    _onFocus: (() => void)[] = []
    onFocus(f: () => void) {
        XXX.push(40);

        this._onFocus.push(f);
    }

    _onNextCallbacks: (() => void)[] = []
    onNext(f: () => void) {
        XXX.push(41);
        this._onNextCallbacks.push(f);
    }

    _onPreviousCallbacks: (() => void)[] = []
    onPrevious(f: () => void) {
        XXX.push(42);
        this._onPreviousCallbacks.push(f);
    }
    
    _timeChangedCallbacks: ((value: number) => void)[] = [];
    onTimeChanged(callback: ((value: number) => void)) {
        XXX.push(43);
        this._timeChangedCallbacks.push(callback);
    }

    protected abstract getMaxValue(): number

    private keyDown(e: KeyboardEvent) {
        XXX.push(44);
        var details = keyPressDetails(this.input, e, this.getMaxValue());
        
        if (details.handled) e.preventDefault();
        if (details.value != null) {
            this._set(details.value);
        }

        if (details.nextPosition != null) {
            if (details.nextPosition < 0) {
                this._onPreviousCallbacks.forEach(f => f());
            } else {
                this.input.selectionEnd = details.nextPosition;
                this.input.selectionStart = details.nextPosition;
                if (details.nextPosition > 1) {
                    this._onNextCallbacks.forEach(f => f());
                }
            }
        }
    }

    private focusOnInput() {
        XXX.push(45);
        this._onFocus
            .slice(0)
            .forEach(f => f());
    }

    set(value: number) {
        XXX.push(46);
        if (value < 0 || value > this.getMaxValue()) throw new Error(`Invalid value "${value}"`);
        this._set(parseInt(value.toFixed()));
    }

    _set(value: number) {
        XXX.push(47);
        this.input.value = `0${value}`.slice(-2);
        this._timeChangedCallbacks
            .slice(0)
            .forEach(f => f(value));
    }

    focus() {
        XXX.push(48);
        this.input.focus();
        this.input.selectionStart = 0;
        this.input.selectionEnd = 0;
    }

    dispose() {
        XXX.push(49);
        this._focusHandler();
        this._keyPressHandler();
        
        this._onFocus.length = 0;
        this._onPreviousCallbacks.length = 0;
        this._onNextCallbacks.length = 0;
        this._timeChangedCallbacks.length = 0;
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