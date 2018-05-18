import { TimePicker } from './components/timePicker';
import { Hand } from './components/hand';
import { Hours } from './components/hours';
import { HtmlTree } from './components/htmlTree';
import { Minutes } from './components/minutes';
import { HourInput } from './components/hourInput';
import { MinuteInput } from './components/minuteInput';

type DIResult<T> =
    {
        result: T,
        dispose: () => void
    }

type Disposable =
    {
        dispose(): void
    }

type Config =
    {
        time: {
            hour: number
            minute: number
        },
        mode: 12 | 24,
        width: string
    }

function toArray<T extends Element>(xs: NodeListOf<Element>): T[] {
    return Array.prototype.slice.call(xs);
}

/** A DI container which creates components and manages their lifecycles */
class DiContext {
    disposables: Disposable[] = [];
    htmlTree: HtmlTree;

    constructor(public config: Config, rootHtmlElement?: HTMLElement) {
        this.htmlTree = new HtmlTree(config.width, rootHtmlElement);
        this.disposables.push(this.htmlTree);
    }

    getRootElement() {
        return this.htmlTree.element;
    }

    getInnerElement<T extends HTMLElement>(selector: string) {
        var el = this.getRootElement().querySelectorAll(selector);
        if (el.length !== 1) {
            var message = el.length ? "Too many elements" : "Cannot find element";
            throw new Error(`${message} "${selector}".`);
        }

        return <T>el[0];
    }

    buildHoursElementList(index: number) {
        var list: HTMLElement[] = [];
    
        for (var i = 0; i < 12; i++) {
            list[i] = <HTMLElement>this.getRootElement().querySelectorAll(`.atp-hours .atp-n-${i}`)[index];
        }

        return list.map((el, i) => {
            if (!el) throw new Error(`Invalid hours element ${i}.`);
            return el;
        });
    }

    buildHoursElements() {
        var hours = this
            .buildHoursElementList(0)
            .concat(this.buildHoursElementList(1));
    
        // re-arrange numbers to put the 12 and 00 at the correct indexes
        hours.splice(11, 0, hours.splice(0, 1)[0]);
        hours.splice(0, 0, hours.splice(12, 1)[0]);
            
        return {
            numbers: hours,
            containerElement: this.getInnerElement(".atp-hours"),
            amPmButtons: this.getInnerElement(".atp-ampm"),
            am: this.getInnerElement<HTMLButtonElement>(".atp-am"),
            pm: this.getInnerElement<HTMLButtonElement>(".atp-pm"),
            label: this.getInnerElement<HTMLButtonElement>(".atp-hour-label")
        };
    }

    hourInput: HourInput | undefined
    buildHoursInput() {
        if (!this.hourInput) {
            var el = this.getInnerElement<HTMLInputElement>(".atp-hour");
            this.hourInput = new HourInput(el);
            this.disposables.push(this.hourInput);
        }

        return this.hourInput;
    }

    hours: Hours | undefined
    buildHours() {
        if (!this.hours) {
            this.hours = new Hours(this.buildHoursInput(), this.buildHoursElements(), this.config.time.hour, true);
            this.disposables.push(this.hours);
        }
        
        return this.hours;
    }
    
    buildMinutesElementList() {
        var list: HTMLElement[] = [];
    
        for (var i = 0; i < 12; i++) {
            list[(i * 5) % 60] = <HTMLElement>this.getRootElement().querySelectorAll(`.atp-minutes .atp-n-${i}`)[0];
        }

        return list.map((el, i) => {
            if (!el) throw new Error(`Invalid hours element ${i}.`);
            return el;
        });
    }

    buildMinutesElements() {
        return {
            containerElement: this.getInnerElement(".atp-minutes"),
            numbers: this.buildMinutesElementList(),
            label: this.getInnerElement<HTMLButtonElement>(".atp-minute-label")
        };
    }

    minuteInput: MinuteInput | undefined
    buildMinutesInput() {
        if (!this.minuteInput) {
            var el = this.getInnerElement<HTMLInputElement>(".atp-minute");
            this.minuteInput = new MinuteInput(el);
            this.disposables.push(this.minuteInput);
        }

        return this.minuteInput;
    }

    minutes: Minutes | undefined
    buildMinutes() {
        if (!this.minutes) {
            this.minutes = new Minutes(this.buildMinutesInput(), this.buildMinutesElements(), this.config.time.minute, true);
            this.disposables.push(this.minutes);
        }
        
        return this.minutes;
    }
    
    buildHandElements() {
        return {
            ballPostion: toArray<HTMLElement>(this.getRootElement().querySelectorAll(".atp-b-pos")),
            hands: toArray<HTMLElement>(this.getRootElement().querySelectorAll(".atp-h-cnt"))
        };
    }

    hand: Hand | undefined
    buildHand(): Hand {
        return this.hand || (this.hand = new Hand(this.buildHandElements()));
    }
    
    buildTimePickerElements() {
        return {
            okButton: this.getInnerElement(".atp-ok"),
            cancelButton: this.getInnerElement(".atp-cancel"),
            clock: this.getInnerElement(".atp-clock")
        };
    }

    timePicker: TimePicker | undefined
    buildTimePicker() {
        if (!this.timePicker) {
            this.timePicker = new TimePicker(
                this.buildTimePickerElements(), 
                this.buildHours(), 
                this.buildMinutes(), 
                this.buildHand(),
                this.config.mode);

            this.disposables.push(this.timePicker);
        }
        
        return this.timePicker;
    }

    dispose() {
        this.disposables
            .splice(0, Number.MAX_VALUE)
            .forEach(x => x.dispose());
    }
}

export {
    DiContext
}