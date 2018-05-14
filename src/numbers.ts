import { NumberInput } from './numberInput';

declare var XXX: number[];
if (!(<any>window).XXX)(<any>window).XXX = [];

const _360 = Math.PI * 2;

enum Position {
    near = "near",
    far = "far"
}

type NumbersElements =
    {
        containerElement: HTMLElement,
        numbers: HTMLElement[]
    }

type GetValueResult =
{ 
    angle: number, 
    value: number, 
    position: Position 
}

function offset(el: HTMLElement | null, prop: "offsetLeft" | "offsetTop") {
    XXX.push(18);
    var offset = -(prop === "offsetTop" ? window.pageYOffset : window.pageXOffset);
    while (el && el instanceof HTMLElement) {
        offset += el[prop];
        el = <HTMLElement>el.offsetParent;
    }

    return offset;
}

abstract class Numbers {
    offsetLeft: number
    offsetTop: number
    width: number
    height: number
    fontSize: number | null
    value: GetValueResult
    elements: NumbersElements & { selectedNumber: HTMLElement | null }

    constructor (public numberInput: NumberInput, elements: NumbersElements, value: number, private visible: boolean) {

        this.elements = {
            ...elements,
            selectedNumber: null
        };
        
        this.refreshOffsets();
        this.set(value);
        this.numberInput.onTimeChanged(v => this.set(v));
        this.numberInput.onNext(() => this.goNext());
        this.numberInput.onPrevious(() => this.goPrevious());
        this.highlightNumber();
        this.numberInput.onFocus(() => this.focusOnInput());

        if (visible) this.show();
        else this.hide();
    }

    _onInputFocus: (() => void)[] = []
    onInputFocus(f: () => void) {
        XXX.push(19);
        this._onInputFocus.push(f);
    }

    _onValueChanged: ((x: number) => void)[] = [];
    onValueChanged(f: (x: number) => void) {
        XXX.push(20);
        this._onValueChanged.push(f);
    }

    _onNextCallbacks: (() => void)[] = []
    onNext(f: () => void) {
        XXX.push(21);
        this._onNextCallbacks.push(f);
    }

    _onPreviousCallbacks: (() => void)[] = []
    onPrevious(f: () => void) {
        XXX.push(22);
        this._onPreviousCallbacks.push(f);
    }

    private focusOnInput() {
        XXX.push(23);
        this._onInputFocus
            .slice(0)
            .forEach(f => f());
    }

    goNext() {
        XXX.push(24);
        this._onNextCallbacks
            .slice(0)
            .forEach(cb => cb());
    }

    goPrevious() {
        XXX.push(25);
        this._onPreviousCallbacks
            .slice(0)
            .forEach(cb => cb());
    }

    /** re-calculate the width, height and position of the elements */
    refreshOffsets() {
        XXX.push(26);
        this.offsetLeft = offset(this.elements.containerElement, "offsetLeft");
        this.offsetTop = offset(this.elements.containerElement, "offsetTop");
        this.width = this.elements.containerElement.offsetWidth;
        this.height = this.elements.containerElement.offsetHeight;
        
        var fontSize = parseFloat(window.getComputedStyle(document.body).fontSize || "x");
        this.fontSize = isNaN(fontSize) ? null : fontSize;
    }

    getVisible() { 
        XXX.push(27);
        return this.visible; 
    }

    setFromPosition (mouseX: number, mouseY: number) {
        XXX.push(28);
        var v = this.getValuesFromPosition(mouseX - this.offsetLeft, mouseY - this.offsetTop);
        this._set(v);
    }

    set (value: number) {
        XXX.push(29);
        var v = this.getValuesFromValue(value);
        this._set(v);
    }

    private _set (value: GetValueResult) {
        XXX.push(30);
        if (this.value && this.value.value === value.value) return null;

        this.value = value;
        this.numberInput.set(value.value);
        this.highlightNumber();
        this._onValueChanged
            .slice(0)
            .forEach(f => f(value.value));
    }

    highlightNumber() {
        XXX.push(31);
        if (this.elements.selectedNumber) {
            this.elements.selectedNumber.classList.remove("smt-number-selected");
        }
        
        this.elements.selectedNumber = this.elements.numbers[this.value.value];
        if (this.elements.selectedNumber) this.elements.selectedNumber.classList.add("smt-number-selected");
    }

    abstract getValuesFromPosition(x: number, y: number): GetValueResult
    abstract getValuesFromValue(value: number): GetValueResult

    show() {
        XXX.push(32);
        this.elements.containerElement.style.transform = "scale(1)";
        this.elements.containerElement.style.opacity = "1";
        this.visible = true;
        this.numberInput.focus();
    }

    hide() {
        XXX.push(33);
        this.elements.containerElement.style.transform = "scale(0)";
        this.elements.containerElement.style.opacity = "0";
        this.visible = false;
    }

    /** alter angle so that it is closest to the given angle, e.g. 500deg -> 140deg */
    normalizeAngle (angle: number) {
        XXX.push(34);

        var angle1 = angle % _360;
        var angle2 = this.value.angle % _360;
        this.value.angle = angle + angle2 - angle1;
    }

    dispose() {
        XXX.push(35);

        this._onPreviousCallbacks.length = 0;
        this._onNextCallbacks.length = 0;
        this._onInputFocus.length = 0;
        this._onValueChanged.length = 0;
    }
}

export {
    Numbers,
    Position
}