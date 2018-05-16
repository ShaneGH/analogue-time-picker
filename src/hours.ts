import { getAngle } from './angle';
import { AmPm, getAMPM } from './distance';
import { Numbers, NumbersElements, Position } from './numbers';
import { convert12hTo24h, convert24hTo12h, getHours } from './time';
import { registerMouseEvent } from './utils';
import { HourInput } from './hourInput';

const _90 = Math.PI / 2;
const _30 = Math.PI / 6;

type HoursElements = NumbersElements &
    {
        am: HTMLButtonElement
        pm: HTMLButtonElement
        amPmButtons: HTMLElement
    }

/**A component to manage the hours */
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

    /** Returns a label. The label is for accessability/screen reading purposes */
    getLabel() { return `Hours ${this.mode}h format`; }

    /** Show/hide the AM/PM buttons based on the current "mode" */
    showHideAmPm() {
        if (this.mode === 12) {
            this.amPmButtons.style.display = null;
            this.amPmButtons.removeAttribute("aria-hidden");
        } else {
            this.amPmButtons.style.display = "none";
            this.amPmButtons.setAttribute("aria-hidden", "true");
        }
    }

    /** Highlight the correct AM/PM button based on the current hour */
    private highlightAmPm() {
        if (!this.value.value || this.value.value > 12) {
            this.am.removeAttribute("aria-pressed");
            this.pm.setAttribute("aria-pressed", "");
        } else {
            this.pm.removeAttribute("aria-pressed");
            this.am.setAttribute("aria-pressed", "");
        }
    }

    private mode: 12 | 24 = 24
    
    /** Set the mode to 12h. Optionally , specify whether the time is AM or PM */
    setTo12Hr(amPm?: AmPm) {
        var value = this.value.value;
        if (amPm) {
            value = convert12hTo24h(
                convert24hTo12h(value), 
                amPm);
        }
        
        this.mode = 12;
        this.showHideAmPm();
        this.hidePMHours();

        var ig = this.ignoreNumberInputChangeEvent();
        try { this.hourInput.setTo12Hr(amPm); } 
        finally { ig(); }
        
        // accessability label changes based on mode
        this.setLabel();
        this.set(value);
    }

    /** Set the mode to 24h. */
    setTo24Hr() {        
        this.mode = 24;
        this.showHideAmPm();
        this.showPMHours();

        var ig = this.ignoreNumberInputChangeEvent();
        try { this.hourInput.setTo24Hr(); } 
        finally { ig(); }
        
        // accessability label changes based on mode
        this.setLabel();
        this.set(this.value.value);
    }

    /** Hide hours 00 and 13 - 23 for 12h format */
    hidePMHours() {
        this.elements.numbers
            .slice(0, 1)
            .concat(this.elements.numbers.slice(13))
            .forEach(x => x.style.display = "none");
    }

    /** Show hours 00 and 13 - 23 for 24h format */
    showPMHours() {
        this.elements.numbers
            .slice(0, 1)
            .concat(this.elements.numbers.slice(13))
            .forEach(x => x.style.display = null);
    }

    /** Get the html element of the number currently selected */
    getSelectedNumberElement(): HTMLElement | null {
        if (this.mode === 12) {
            return this.elements.numbers[convert24hTo12h(this.value.value)];
        }

        return super.getSelectedNumberElement();
    }

    /** Get the hour, angle, etc... based on the mouse position */
    getValuesFromPosition(x: number, y: number) {
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
    
    /** Get the hour, angle, etc... based on the hour */
    getValuesFromValue(value: number) {
        value = parseInt(value.toFixed()) % 24;
        var angle = (value * _30) + _90;
        
        return {
            angle: angle,
            value: value,
            position: this.mode === 12 || (value && value <= 12) ? Position.far : Position.near
        }
    }

    dispose() {
        super.dispose();
        this._toAm();
        this._toPm();
    }
}

export {
    Hours
}