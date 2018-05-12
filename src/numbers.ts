import { getAngleDelta } from "./angle";

const _360 = Math.PI * 2;

enum Position {
    near = "near",
    far = "far"
}

type Elements =
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
    containerElement: HTMLElement
    numbers: HTMLElement[]
    selectedNumber: HTMLElement | null = null

    constructor (elements: Elements, value: number, private visible = true) {

        this.containerElement = elements.containerElement;
        this.numbers = elements.numbers;

        this.refreshOffsets();
        this.value = this.getValuesFromValue(value);
        this.highlightNumber();

        if (visible) this.show();
        else this.hide();
    }

    /** re-calculate the width, height and position of the elements */
    refreshOffsets() {
        this.offsetLeft = offset(this.containerElement, "offsetLeft");
        this.offsetTop = offset(this.containerElement, "offsetTop");
        this.width = this.containerElement.offsetWidth;
        this.height = this.containerElement.offsetHeight;
        
        var fontSize = parseFloat(window.getComputedStyle(document.body).fontSize || "x");
        this.fontSize = isNaN(fontSize) ? null : fontSize;
    }

    getVisible() { return this.visible; }

    set (mouseX: number, mouseY: number) {
        var v = this.getValuesFromPosition(mouseX - this.offsetLeft, mouseY - this.offsetTop);
        if (v.value === this.value.value) return null;

        var delta = getAngleDelta(this.value.angle, v.angle);
        v.angle = this.value.angle + delta;
        this.value = v;

        this.highlightNumber();
        return v;
    }

    highlightNumber() {
        if (this.selectedNumber) {
            this.selectedNumber.classList.remove("smt-number-selected");
        }
        
        this.selectedNumber = this.numbers[this.value.value];
        if (this.selectedNumber) this.selectedNumber.classList.add("smt-number-selected");
    }

    abstract getValuesFromPosition(x: number, y: number): GetValueResult
    abstract getValuesFromValue(value: number): GetValueResult

    show() {
        this.containerElement.style.transform = "scale(1)";
        this.containerElement.style.opacity = "1";
        this.visible = true;
    }

    hide() {
        this.containerElement.style.transform = "scale(0)";
        this.containerElement.style.opacity = "0";
        this.visible = false;
    }

    /** alter angle so that it is closest to the given angle, e.g. 500deg -> 140deg */
    normalizeAngle (angle: number) {
        var angle1 = angle % _360;
        var angle2 = this.value.angle % _360;
        this.value.angle = angle + angle2 - angle1;
    }
}

export {
    Numbers,
    Position
}