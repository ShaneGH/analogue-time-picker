import { registerEvent } from "./utils";
import { MouseTracker } from "./mouseTracker";
import { getAngle, getAngleDelta } from "../unitTests/angle";
import { getMinutes, getHours } from "./time";
import { getAMPM, AmPm } from "./distance";

type Time = 
    {
        hour: number,
        minute: number,
        handAngle: number,
        amPm: AmPm
    }

type Elements = 
    {
        clock: HTMLElement,
        hourContainer: HTMLElement,
        minuteContainer: HTMLElement,
        hands: HTMLElement[],
        ballPostion: HTMLElement[]
    }

function buildElements(root: HTMLElement): Elements {
    var el = {
        clock: root,
        hourContainer: <HTMLElement>root.querySelectorAll(".smt-hours")[0],
        minuteContainer: <HTMLElement>root.querySelectorAll(".smt-minutes")[0],
        hands: Array.prototype.slice.call(root.querySelectorAll(".smt-h-cnt")),
        ballPostion: Array.prototype.slice.call(root.querySelectorAll(".smt-b-pos"))
    };

    if (!el.clock ||
        !el.hourContainer ||
        !el.minuteContainer ||
        !el.hands ||
        !el.ballPostion) {

        throw new Error("Invalid html element");
    }

    return el;
}

const _2PiOver60 = 2 * Math.PI / 60;
function getAngleForMinutes(minutes: number) {
    minutes = (parseInt(Math.abs(minutes).toFixed()) - 45) % 60;
    return minutes * _2PiOver60;
}

function getAngleForHours(hours: number) {
    return getAngleForMinutes(hours * 5);
}

const defaultTime = {hour: 0, minute: 0};
function buildTime(time?: {hour: number | null, minute: number | null}) {
    if (!time) {
        time = defaultTime;
    }

    var h = time.hour || defaultTime.hour;
    var m = time.minute || defaultTime.minute;
    return {
        hour: h % 12 + (h > 12 ? 12 : 0),
        amPm: h > 12 ? AmPm.pm : AmPm.am,
        minute: m % 60,
        handAngle: 0
    };
}

enum Modes {
    hours = "hours",
    minutes = "minutes"
}

type TimeInput =
    {
        hour: number | null
        minute: number | null
    }

class Clock {
    time: Time
    elements: Elements
    mode = Modes.hours

    _createTracker: (() => void) | null = null; 

    constructor(public rootElement: HTMLElement, time?: TimeInput) {
        this.time = buildTime(time);

        this.elements = buildElements(rootElement);
        this._createTracker = registerEvent(this.elements.clock, "mousedown", e => this.createTracker(e));
        
        this.setHours(getAngleForHours(this.time.hour), this.time.amPm);
        this.setMode(Modes.hours);
    }

    mouseTracker: MouseTracker | null = null;
    createTracker(e: MouseEvent) {
        this.setTime(e);

        if (this.mouseTracker) return;
        var mouseTracker = this.mouseTracker = new MouseTracker();

        mouseTracker.onMouseUp(() => {
            mouseTracker.dispose();
            if (mouseTracker === this.mouseTracker) this.mouseTracker = null;

            if (this.mode === Modes.hours) {
                this.elements.ballPostion.forEach(b => b.classList.remove("smt-b-pos-pm"));
                this.setMinutes(getAngleForMinutes(this.time.minute));
                this.setMode(Modes.minutes);
            }
        });

        mouseTracker.onMouseMove(e => this.setTime(e));
    } 

    setMode(mode: Modes) {
        var show: HTMLElement
        var hide: HTMLElement
        switch (mode) {
            case Modes.hours:
                show = this.elements.hourContainer;
                hide = this.elements.minuteContainer;
                break;
            case Modes.minutes:
                hide = this.elements.hourContainer;
                show = this.elements.minuteContainer;
                break;
            default:
                throw new Error(`Invalid mode: "${mode}". Only "${Modes.hours}" and "${Modes.minutes}" are supported`)
        }
        
        show.style.transform = "scale(1)";
        show.style.opacity = "1";

        hide.style.transform = "scale(0)";
        hide.style.opacity = "0";
        
        this.mode = mode;
    }

    setTime(e: MouseEvent) {
        var angle = getAngle(e.clientX, e.clientY, this.elements.clock);
        if (this.mode === Modes.hours) {
            var amPm = getAMPM(e.clientX, e.clientY, this.elements.clock);
            this.setHours(angle, amPm);
        } else {
            this.setMinutes(angle);
        }
    }

    setHours(angle: number, amPm: AmPm) {
        var delta = getAngleDelta(this.time.handAngle, angle);
        if (!delta) return;

        angle = this.time.handAngle + delta;
        var h = getHours(angle, amPm);

        this.time.hour = h.hour;
        this.time.amPm = h.amPm;        
        this.time.handAngle = h.handAngle;

        if (amPm == AmPm.pm) {
            this.time.hour += 12;
        }

        this.setHandAngleToHours(amPm === AmPm.pm); 
    }

    setMinutes(angle: number) {
        var delta = getAngleDelta(this.time.handAngle, angle);
        if (!delta) return;

        angle = this.time.handAngle + delta;
        var m = getMinutes(angle);

        this.time.minute = m.minute;
        this.time.handAngle = m.handAngle;

        this.setHandAngleToMinutes(); 
    }

    setHandAngleToHours(isPm: boolean) {
        this.elements.hands.forEach(h => h.style.transform = `rotate(${this.time.handAngle}rad)`);
        isPm ?
            this.elements.ballPostion.forEach(b => b.classList.add("smt-b-pos-pm")) :
            this.elements.ballPostion.forEach(b => b.classList.remove("smt-b-pos-pm"));
    }

    setHandAngleToMinutes() {
        this.elements.hands.forEach(h => h.style.transform = `rotate(${this.time.handAngle}rad)`);
    }
    
    dispose() {
        if (this.mouseTracker) {
            this.mouseTracker.dispose();
            this.mouseTracker = null;
        }
        
        if (this._createTracker) {
            this._createTracker();
            this._createTracker = null;
        }
    }
}

export {
    Clock,
    TimeInput
}