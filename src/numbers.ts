import { NumberInput } from './numberInput';

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
        this.highlightNumber();

        if (visible) this.show();
        else this.hide();
    }

    _onValueChanged: ((x: number) => void)[] = [];
    onValueChanged(f: (x: number) => void) {
        this._onValueChanged.push(f);
    }

    _onNextCallbacks: (() => void)[] = []
    onNext(f: () => void) {
        this._onNextCallbacks.push(f);
    }

    goNext() {
        this._onNextCallbacks
            .slice(0)
            .forEach(cb => cb());
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
        this._set(v);
    }

    set (value: number) {
        var v = this.getValuesFromValue(value);
        this._set(v);
    }

    private _set (value: GetValueResult) {
        if (this.value && this.value.value === value.value) return null;

        this.value = value;
        this.numberInput.set(value.value);
        this.highlightNumber();
        this._onValueChanged
            .slice(0)
            .forEach(f => f(value.value));
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
        this.numberInput.focus();
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
        this._onNextCallbacks.length = 0;
    }
}

export {
    Numbers,
    Position
}