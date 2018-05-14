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

    private _getElement<T extends HTMLElement>(selector: string) {
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
            containerElement: this._getElement(".smt-hours"),
            numbers: hours
        };
    }

    buildHoursInput() {
        var el = this._getElement<HTMLInputElement>(".smt-hour");
        var hours = new HourInput(el);
        this.disposables.push(hours);

        return hours;
    }

    buildHours() {
        var hr = new Hours(this.buildHoursInput(), this.buildHoursElements(), this.config.time.hour, true);
        this.disposables.push(hr);
        return hr;
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
            containerElement: this._getElement(".smt-minutes"),
            numbers: this.buildMinutesElementList()
        };
    }

    buildMinutesInput() {
        var el = this._getElement<HTMLInputElement>(".smt-minute");
        var hours = new MinuteInput(el);
        this.disposables.push(hours);

        return hours;
    }

    buildMinutes() {
        var min = new Minutes(this.buildMinutesInput(), this.buildMinutesElements(), this.config.time.hour, true);
        this.disposables.push(min);
        return min;
    }
    
    buildHandElements() {
        return {
            ballPostion: toArray<HTMLElement>(this.getRootElement().querySelectorAll(".smt-b-pos")),
            hands: toArray<HTMLElement>(this.getRootElement().querySelectorAll(".smt-h-cnt"))
        };
    }

    buildHand(): Hand {
        return new Hand(this.buildHandElements());
    }
    
    buildClockElements() {
        return {
            okButton: this._getElement(".smt-ok"),
            cancelButton: this._getElement(".smt-cancel"),
            clock: this._getElement(".smt-clock")
        };
    }

    buildClock() {
        var clock = new Clock(
            this.buildClockElements(), 
            this.buildHours(), 
            this.buildMinutes(), 
            this.buildHand(), 
            this.config.closeOnSelect);

        this.disposables.push(clock);
        
        return clock;
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