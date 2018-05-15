import { Clock } from './clock';
import { Hand } from './hand';
import { Hours } from './hours';
import { Minutes } from './minutes';
import { HourInput, MinuteInput } from './numberInput';
import { create, append, remove } from './template';
import { HtmlTree } from './htmlTree';

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
        closeOnSelect: boolean
    }

function toArray<T extends Element>(xs: NodeListOf<Element>): T[] {
    return Array.prototype.slice.call(xs);
}

class DiContext {
    disposables: Disposable[] = [];
    htmlTree: HtmlTree;

    constructor(public config: Config, rootHtmlElement?: HTMLElement) {
        this.htmlTree = new HtmlTree(rootHtmlElement);
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
            list[i] = <HTMLElement>this.getRootElement().querySelectorAll(`.smt-hours .smt-n-${i}`)[index];
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
    
        // re-arrange numbers to put the 12 and 24 in the correct places
        hours.splice(11, 0, hours.splice(0, 1)[0]);
        hours.splice(0, 0, hours.splice(12, 1)[0]);
            
        return {
            numbers: hours,
            containerElement: this.getInnerElement(".smt-hours"),
            am: this.getInnerElement<HTMLButtonElement>(".smt-am"),
            pm: this.getInnerElement<HTMLButtonElement>(".smt-pm")
        };
    }

    hourInput: HourInput | undefined
    buildHoursInput() {
        if (!this.hourInput) {
            var el = this.getInnerElement<HTMLInputElement>(".smt-hour");
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
            list[(i * 5) % 60] = <HTMLElement>this.getRootElement().querySelectorAll(`.smt-minutes .smt-n-${i}`)[0];
        }

        return list.map((el, i) => {
            if (!el) throw new Error(`Invalid hours element ${i}.`);
            return el;
        });
    }

    buildMinutesElements() {
        return {
            containerElement: this.getInnerElement(".smt-minutes"),
            numbers: this.buildMinutesElementList()
        };
    }

    minuteInput: MinuteInput | undefined
    buildMinutesInput() {
        if (!this.minuteInput) {
            var el = this.getInnerElement<HTMLInputElement>(".smt-minute");
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
            ballPostion: toArray<HTMLElement>(this.getRootElement().querySelectorAll(".smt-b-pos")),
            hands: toArray<HTMLElement>(this.getRootElement().querySelectorAll(".smt-h-cnt"))
        };
    }

    hand: Hand | undefined
    buildHand(): Hand {
        return this.hand || (this.hand = new Hand(this.buildHandElements()));
    }
    
    buildClockElements() {
        return {
            okButton: this.getInnerElement(".smt-ok"),
            cancelButton: this.getInnerElement(".smt-cancel"),
            clock: this.getInnerElement(".smt-clock")
        };
    }

    clock: Clock | undefined
    buildClock() {
        if (!this.clock) {
            this.clock = new Clock(
                this.buildClockElements(), 
                this.buildHours(), 
                this.buildMinutes(), 
                this.buildHand(), 
                this.config.closeOnSelect);

            this.disposables.push(this.clock);
        }
        
        return this.clock;
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