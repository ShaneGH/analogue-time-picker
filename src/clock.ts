import { registerEvent } from "./utils";
import { MouseTracker } from "./mouseTracker";
import { getAngle, getAngleDelta } from "./angle";
import { getMinutes, getHours } from "./time";
import { getAMPM, AmPm } from "./distance";
import { buildElements, Elements } from "./componentElements";
import { offset } from "./html";

type Time = 
    {
        hour: number,
        minute: number,
        handAngle: number
    }

const _360 = 2 * Math.PI;
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

type FaceElements =
    {
        hourContainer: HTMLElement
        minuteContainer: HTMLElement
    }

class Numbers {
    constructor (public face: HTMLElement, public value: number, private visible = true) {
    }

    set(x: number, y: number) {
    }

    show() {        
        this.face.style.transform = "scale(1)";
        this.face.style.opacity = "1";
    }

    hide() {
        this.face.style.transform = "scale(0)";
        this.face.style.opacity = "0";
    }
}

class Face {

    constructor (public elements: FaceElements, public  mode = Modes.hours) {
        this.setMode(mode);
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
}

type BallElements =
    {
        ballPostion: HTMLElement[]
    }

class Ball {
    constructor(public elements: BallElements, public mode = AmPm.am) {
    }

    setToAm() {
        this.elements.ballPostion.forEach(b => b.classList.remove("smt-b-pos-pm"));
        this.mode = AmPm.am;
    }

    setToPm() {
        this.elements.ballPostion.forEach(b => b.classList.add("smt-b-pos-pm"));
        this.mode = AmPm.pm;
    }
}

class Clock {
    time: Time
    face: Face
    ball: Ball

    _createTracker: (() => void) | null = null; 

    constructor(public elements: Elements, time?: TimeInput) {
        this.face = new Face(elements, Modes.hours);
        this.ball = new Ball(elements, AmPm.am);

        this.time = buildTime(time);
        this._createTracker = registerEvent(this.elements.clock, "mousedown", e => this.createTracker(e));
        
        this.setComponentHours(getAngleForHours(this.time.hour), this.time.hour > 12 ? AmPm.pm : AmPm.am, true);
    }

    mouseTracker: {tracker: MouseTracker; offsetX: number; offsetY: number } | null = null;
    createTracker(e: MouseEvent) {
        this.setTime(e);

        if (this.mouseTracker) return;
        var mouseTracker = this.mouseTracker = {
            tracker: new MouseTracker(),
            offsetX: this.getOffsetX(),
            offsetY: this.getOffsetY()
        };

        mouseTracker.tracker.onMouseUp(() => {
            mouseTracker.tracker.dispose();
            if (mouseTracker === this.mouseTracker) this.mouseTracker = null;

            if (this.face.mode === Modes.hours) {
                this.setComponentMinutes(getAngleForMinutes(this.time.minute), true);
                this.ball.setToAm();
                this.face.setMode(Modes.minutes);
            }
        });

        mouseTracker.tracker.onMouseMove(e => this.setTime(e));
    } 

    getOffsetX() {
        if (this.mouseTracker) return this.mouseTracker.offsetX;
        else return offset(this.elements.face, "offsetLeft");
    }

    getOffsetY() {
        if (this.mouseTracker) return this.mouseTracker.offsetX;
        else return offset(this.elements.face, "offsetTop")
    }

    setTime(e: MouseEvent) {
        var offsetX = this.getOffsetX();
        var offsetY = this.getOffsetY();
        var angle = getAngle(e.clientX - offsetX, e.clientY - offsetY, this.elements.face);
        if (this.face.mode === Modes.hours) {
            var amPm = getAMPM(e.clientX - offsetX, e.clientY - offsetY, this.elements.face);
            this.setComponentHours(angle, amPm);
        } else {
            this.setComponentMinutes(angle);
        }
    }

    setComponentHours(angle: number, amPm: AmPm, force = false) {
        var delta = getAngleDelta(this.time.handAngle, angle);
        if (!force && !delta) return;

        angle = this.time.handAngle + delta;
        var h = getHours(angle);

        this.time.hour = h.hour;
        this.time.handAngle = h.handAngle;

        if (amPm == AmPm.pm) {
            this.time.hour += 12;
        }

        this.setUiHours(); 
    }

    setComponentMinutes(angle: number, force = false) {
        var delta = getAngleDelta(this.time.handAngle, angle);
        if (!force && !delta) return;

        angle = this.time.handAngle + delta;
        var m = getMinutes(angle);

        this.time.minute = m.minute;
        this.time.handAngle = m.handAngle;

        this.setUiMinutes(); 
    }

    setUiHours() {
        if (this.elements.selectedNumber) {
            this.elements.selectedNumber.classList.remove("smt-number-selected");
        }
        
        this.elements.hands.forEach(h => h.style.transform = `rotate(${this.time.handAngle}rad)`);
        this.elements.selectedNumber = this.elements.hours[this.time.hour];
        this.elements.selectedNumber.classList.add("smt-number-selected");
        
        this.time.hour > 12 ?
            this.ball.setToPm() :
            this.ball.setToAm();
    }

    setUiMinutes() {
        if (this.elements.selectedNumber) {
            this.elements.selectedNumber.classList.remove("smt-number-selected");
        }
        
        this.elements.selectedNumber = this.elements.minutes[this.time.minute];
        if (this.elements.selectedNumber) this.elements.selectedNumber.classList.add("smt-number-selected");

        this.elements.hands.forEach(h => h.style.transform = `rotate(${this.time.handAngle}rad)`);
    }
    
    dispose() {
        if (this.mouseTracker) {
            this.mouseTracker.tracker.dispose();
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