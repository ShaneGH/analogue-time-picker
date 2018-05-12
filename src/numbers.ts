import { getAngleDelta } from "./angle";
import { registerKeyEvent } from "./utils";

const _360 = Math.PI * 2;

enum Position {
    near = "near",
    far = "far"
}

type Elements =
    {
        containerElement: HTMLElement,
        numbers: HTMLElement[],
        numberInput: HTMLInputElement
    }

type GetValueResult =
{ 
    angle: number, 
    value: number, 
    position: Position 
}

function offset(el: HTMLElement | null, prop: "offsetLeft" | "offsetTop") {
    var offset = -(prop === "offsetTop" ? window.pageYOffset : window.pageXOffset);
    while (el && el instanceof HTMLElement) {
        offset += el[prop];
        el = <HTMLElement>el.offsetParent;
    }

    return offset;
}

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

class NumberInput {

    _keyPressHandler: (() => void) | null
    constructor(public input: HTMLInputElement, public selectNext: () => void) {
        this._keyPressHandler = registerKeyEvent(input, "keydown", e => this.onKeyDown(e));
    }

    onKeyDown(e: KeyboardEvent) {
        var details = keyPressDetails(this.input, e, 23);
        
        if (details.handled) e.preventDefault();
        if (details.value != null) {
            this.input.value = `0${details.value}`.slice(-2);
        }

        if (details.position) {
            this.input.selectionEnd = details.position;
            this.input.selectionStart = details.position;
            if (details.position > 1) {
                this.selectNext();
            }
        }
    }
    
    _timeChangedCallbacks: ((hours: number, minutes: number) => void)[] = [];
    onTimeChanged(callback: ((hours: number, minutes: number) => void)) {
        this._timeChangedCallbacks.push(callback);
    }

    //TODO
    // focusOnMinutes() {
    //     this.minutesElement.focus();
    //     this.minutesElement.selectionStart = 0;
    //     this.minutesElement.selectionEnd = 0;
    // }

    dispose() {
        if (this._keyPressHandler) {
            this._keyPressHandler();
            this._keyPressHandler = null;
        }

        this._timeChangedCallbacks = [];
    }
}

abstract class Numbers {
    numberInput: NumberInput
    offsetLeft: number
    offsetTop: number
    width: number
    height: number
    fontSize: number | null
    value: GetValueResult
    elements: Elements & { selectedNumber: HTMLElement | null }

    constructor (elements: Elements, value: number, private visible = true) {

        this.elements = {
            ...elements,
            selectedNumber: null
        };

        this.numberInput = new NumberInput(elements.numberInput, () => {});
        this.refreshOffsets();
        this.value = this.getValuesFromValue(value);
        this.highlightNumber();

        if (visible) this.show();
        else this.hide();
    }

    /** re-calculate the width, height and position of the elements */
    refreshOffsets() {
        this.offsetLeft = offset(this.elements.containerElement, "offsetLeft");
        this.offsetTop = offset(this.elements.containerElement, "offsetTop");
        this.width = this.elements.containerElement.offsetWidth;
        this.height = this.elements.containerElement.offsetHeight;
        
        var fontSize = parseFloat(window.getComputedStyle(document.body).fontSize || "x");
        this.fontSize = isNaN(fontSize) ? null : fontSize;
    }

    getVisible() { return this.visible; }

    setFromPosition (mouseX: number, mouseY: number) {
        var v = this.getValuesFromPosition(mouseX - this.offsetLeft, mouseY - this.offsetTop);
        return this._set(v);
    }

    set (value: number) {
        var v = this.getValuesFromValue(value);
        return this._set(v);
    }

    private _set (value: GetValueResult) {
        if (value.value === this.value.value) return null;

        var delta = getAngleDelta(this.value.angle, value.angle);
        value.angle = this.value.angle + delta;
        this.value = value;

        this.elements.numberInput.value = `0${this.value.value}`.slice(-2);
        this.highlightNumber();
        return value;
    }

    highlightNumber() {
        if (this.elements.selectedNumber) {
            this.elements.selectedNumber.classList.remove("smt-number-selected");
        }
        
        this.elements.selectedNumber = this.elements.numbers[this.value.value];
        if (this.elements.selectedNumber) this.elements.selectedNumber.classList.add("smt-number-selected");
    }

    abstract getValuesFromPosition(x: number, y: number): GetValueResult
    abstract getValuesFromValue(value: number): GetValueResult

    show() {
        this.elements.containerElement.style.transform = "scale(1)";
        this.elements.containerElement.style.opacity = "1";
        this.visible = true;
    }

    hide() {
        this.elements.containerElement.style.transform = "scale(0)";
        this.elements.containerElement.style.opacity = "0";
        this.visible = false;
    }

    /** alter angle so that it is closest to the given angle, e.g. 500deg -> 140deg */
    normalizeAngle (angle: number) {
        var angle1 = angle % _360;
        var angle2 = this.value.angle % _360;
        this.value.angle = angle + angle2 - angle1;
    }

    dispose() {
        this.numberInput.dispose();
    }
}

export {
    Numbers,
    Position
}