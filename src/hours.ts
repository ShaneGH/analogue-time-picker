import { getAngle } from "./angle";
import { Numbers, Position, NumbersElements } from "./numbers";
import { getAMPM, AmPm } from "./distance";
import { getHours, convert24hTo12h, convert12hTo24h } from "./time";
import { NumberInput, HourInput } from "./numberInput";
import { registerMouseEvent } from "./utils";

declare var XXX: number[];
if (!(<any>window).XXX)(<any>window).XXX = [];

const _90 = Math.PI / 2;
const _30 = Math.PI / 6;

type HoursElements = NumbersElements &
    {
        am: HTMLButtonElement
        pm: HTMLButtonElement
        amPmButtons: HTMLElement
    }

class Hours extends Numbers {

    am: HTMLElement
    _toAm: () => void
    pm: HTMLElement
    _toPm: () => void
    amPmButtons: HTMLElement

    constructor (private hourInput: HourInput, elements: HoursElements, value: number, visible: boolean) {
        super(hourInput, elements, value, visible);

        this.am = elements.am;
        this._toAm = registerMouseEvent(this.am, "click", () => this.setTo12Hr(AmPm.am));
        
        this.pm = elements.pm;
        this._toPm = registerMouseEvent(this.pm, "click", () => this.setTo12Hr(AmPm.pm));

        this.amPmButtons = elements.amPmButtons;

        this.showHideAmPm();
        this.onValueChanged(() => this.highlightAmPm());
    }

    getLabel() { return `Hours ${this.mode}h format`; }

    showHideAmPm() {
        XXX.push(64);
        if (this.mode === 12) {
            this.amPmButtons.style.display = null;
            this.amPmButtons.removeAttribute("aria-hidden");
        } else {
            this.amPmButtons.style.display = "none";
            this.amPmButtons.setAttribute("aria-hidden", "true");
        }
    }

    private highlightAmPm() {
        XXX.push(65);
        if (!this.value.value || this.value.value > 12) {
            this.am.removeAttribute("aria-pressed");
            this.pm.setAttribute("aria-pressed", "");
        } else {
            this.pm.removeAttribute("aria-pressed");
            this.am.setAttribute("aria-pressed", "");
        }
    }

    private mode: 12 | 24 = 24
    setTo12Hr(amPm?: AmPm) {
        XXX.push(66);
        var value = this.value.value;
        if (amPm) {
            value = convert12hTo24h(
                convert24hTo12h(value), 
                amPm);
        }
        
        this.mode = 12;
        this.showHideAmPm();
        this.hideHours();

        var ig = this.ignoreNumberInputChangeEvent();
        try { this.hourInput.setTo12Hr(amPm); } 
        finally { ig(); }
        
        // accessability label changes based on mode
        this.setLabel();
        this.set(value);
    }

    setTo24Hr() {   
        XXX.push(67);     
        this.mode = 24;
        this.showHideAmPm();
        this.showHours();

        var ig = this.ignoreNumberInputChangeEvent();
        try { this.hourInput.setTo24Hr(); } 
        finally { ig(); }
        
        // accessability label changes based on mode
        this.setLabel();
        this.set(this.value.value);
    }

    hideHours() {
        XXX.push(68);
        this.elements.numbers
            .slice(0, 1)
            .concat(this.elements.numbers.slice(13))
            .forEach(x => x.style.display = "none");
    }

    showHours() {
        XXX.push(69);
        this.elements.numbers
            .slice(0, 1)
            .concat(this.elements.numbers.slice(13))
            .forEach(x => x.style.display = null);
    }

    getSelectedNumber(): HTMLElement | null {
        XXX.push(70);
        if (this.mode === 12) {
            return this.elements.numbers[convert24hTo12h(this.value.value)];
        }

        return super.getSelectedNumber();
    }

    getValuesFromPosition(x: number, y: number) {
        XXX.push(57);

        var angle = getAngle(x, y, this.elements.containerElement.offsetWidth, this.elements.containerElement.offsetHeight);
        var amPm = this.mode === 24 ?
            getAMPM(x, y, this.elements.containerElement.offsetWidth, this.elements.containerElement.offsetHeight, this.fontSize) :
            this.value.value && this.value.value <= 12 ? AmPm.am : AmPm.pm;
        var value = getHours(angle, amPm);

        return {
            angle: value.handAngle,
            value: value.hour,
            position: this.mode === 12 || amPm === AmPm.am ? Position.far : Position.near
        }
    }
    
    getValuesFromValue(value: number) {
        XXX.push(58);

        value = parseInt(value.toFixed()) % 24;
        var angle = (value * _30) + _90;
        
        return {
            angle: angle,
            value: value,
            position: this.mode === 12 || (value && value <= 12) ? Position.far : Position.near
        }
    }

    dispose() {
        XXX.push(71);
        super.dispose();
        this._toAm();
        this._toPm();
    }
}

export {
    Hours
}