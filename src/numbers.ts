import { NumberInput } from './numberInput';

const _360 = Math.PI * 2;

enum Position {
    near = "near",
    far = "far"
}

type NumbersElements =
    {
        containerElement: HTMLElement,
        label: HTMLElement,
        numbers: HTMLElement[]
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

function round(x: number, decimals: number) {
    return parseFloat(x.toFixed(decimals));
}

function sign(x: number) {
    if (!x) return 0;
    if (x > 0) return 1;
    return -1;
}

function compareAngles(x: number, y: number) {
    while (x < 0) x += _360;
    while (x >= 0) x -= _360;
    while (y < 0) y += _360;
    while (y >= 0) y -= _360;

    return sign(round(x, 5) - round(y, 5));
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
        this.numberInput.onTimeChanged(v => this.numberInputTimeChanged(v));
        this.numberInput.onNext(() => this.goNext());
        this.numberInput.onPrevious(() => this.goPrevious());
        this.highlightNumber();
        this.numberInput.onFocus(() => this.focusOnInput());
        this.onRenderValuesChanged(rv => this.triggerValueChanged(rv.value));

        if (visible) this.show();
        else this.hide();

        this.setLabel();
    }

    abstract getValuesFromPosition(x: number, y: number): GetValueResult
    abstract getLabel(): string
    abstract getValuesFromValue(value: number): GetValueResult

    _onInputFocus: (() => void)[] = []
    onInputFocus(f: () => void) {
        this._onInputFocus.push(f);
    }

    _onRenderValuesChanged: ((x: GetValueResult) => void)[] = [];

    /** Triggers if value, angle or position changes */
    onRenderValuesChanged(f: (x: GetValueResult) => void) {
        this._onRenderValuesChanged.push(f);
    }

    _onValueChanged: ((x: number) => void)[] = [];
    
    /** Triggers only if value changes */
    onValueChanged(f: (x: number) => void) {
        this._onValueChanged.push(f);
    }

    _onNextCallbacks: (() => void)[] = []
    onNext(f: () => void) {
        this._onNextCallbacks.push(f);
    }

    _onPreviousCallbacks: (() => void)[] = []
    onPrevious(f: () => void) {
        this._onPreviousCallbacks.push(f);
    }

    setLabel() {
        this.elements.label.innerHTML = this.getLabel();
    }

    private focusOnInput() {
        this._onInputFocus
            .slice(0)
            .forEach(f => f());
    }

    _triggerValue: number | null = null;
    private triggerValueChanged(value: number) {
        if (this._triggerValue === value) return;
        this._triggerValue = value;

        this._onValueChanged
            .slice(0)
            .forEach(f => f(value));
    }

    goNext() {
        this._onNextCallbacks
            .slice(0)
            .forEach(cb => cb());
    }

    goPrevious() {
        this._onPreviousCallbacks
            .slice(0)
            .forEach(cb => cb());
    }

    /** re-calculate the width, height and position of the elements */
    refreshOffsets() {
        this.offsetLeft = offset(this.elements.containerElement, "offsetLeft");
        this.offsetTop = offset(this.elements.containerElement, "offsetTop");
        this.width = this.elements.containerElement.offsetWidth;
        this.height = this.elements.containerElement.offsetHeight;
        
        var fontSize = parseFloat(window.getComputedStyle(this.elements.containerElement).fontSize || "x");
        if (isNaN(fontSize))
            fontSize = parseFloat(window.getComputedStyle(document.body).fontSize || "x");
            
        this.fontSize = isNaN(fontSize) ? null : fontSize;
    }

    getVisible() { return this.visible; }

    setFromPosition (mouseX: number, mouseY: number) {
        var v = this.getValuesFromPosition(mouseX - this.offsetLeft, mouseY - this.offsetTop);
        this._set(v);
    }

    set (value: number) {
        var v = this.getValuesFromValue(value);
        this._set(v);
    }

    private _set (value: GetValueResult) {
        if (this.value && 
            this.value.value === value.value && 
            !compareAngles(this.value.angle, value.angle) && 
            this.value.position === value.position) return;

        this.value = value;
        this.numberInput.set(value.value);
        this.highlightNumber();
        this._onRenderValuesChanged
            .slice(0)
            .forEach(f => f(value));
    }

    highlightNumber() {
        if (this.elements.selectedNumber) {
            this.elements.selectedNumber.classList.remove("mtl-number-selected");
        }
        
        this.elements.selectedNumber = this.getSelectedNumber();
        if (this.elements.selectedNumber) this.elements.selectedNumber.classList.add("mtl-number-selected");
    }

    getSelectedNumber(): HTMLElement | null {
        return this.elements.numbers[this.value.value] || null;
    }

    private numberInputTimeChanged(v: number) {
        if (!this.ignoreCount) this.set(v);
    }

    private ignoreCount = 0
    protected ignoreNumberInputChangeEvent() {
        this.ignoreCount++;
        var done = false;
        return () => {
            if (done) return;
            done = true;

            this.ignoreCount--;
        };
    }

    show() {
        this.elements.containerElement.style.transform = "scale(1)";
        this.elements.containerElement.style.opacity = "1";
        this.visible = true;
        this.numberInput.focus();
    }

    hide() {
        this.elements.containerElement.style.transform = "scale(0)";
        this.elements.containerElement.style.opacity = "0";
        this.visible = false;
        this.numberInput.blur();
    }

    /** alter angle so that it is closest to the given angle, e.g. 500deg -> 140deg */
    normalizeAngle (angle: number) {
        var angle1 = angle % _360;
        var angle2 = this.value.angle % _360;
        this.value.angle = angle + angle2 - angle1;
    }

    dispose() {
        this._onValueChanged.length = 0;
        this._onPreviousCallbacks.length = 0;
        this._onNextCallbacks.length = 0;
        this._onInputFocus.length = 0;
        this._onRenderValuesChanged.length = 0;
    }
}

export {
    Numbers,
    NumbersElements,
    Position
}