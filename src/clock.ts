import { registerEvent } from "./utils";
import { MouseTracker } from "./mouseTracker";
import { getAngle, getAngleDelta } from "./angle";
import { getMinutes, getHours } from "./time";
import { getAMPM, AmPm } from "./distance";
import { buildElements, Elements } from "./componentElements";
import { offset } from "./html";
import { Numbers, Position } from "./numbers";
import { Minutes } from "./minutes";
import { Hours } from "./hours";
import { Hand } from "./hand";

type TimeInput =
    {
        hour: number | null
        minute: number | null
    }

class Clock {
    hours: Hours
    minutes: Minutes
    hand: Hand

    _createTracker: (() => void) | null = null; 

    constructor(elements: Elements, time?: TimeInput) {

        var hr = time ? time.hour || 0 : 0;
        this.hours = new Hours({
            containerElement: elements.hourContainer,
            numbers: elements.hours
        }, hr, true);

        var min = time ? time.minute || 0 : 0;
        this.minutes = new Minutes({
            containerElement: elements.minuteContainer,
            numbers: elements.minutes
        }, min, false);

        this.hand = new Hand(elements, this.hours.value.angle, this.hours.value.position);

        this._createTracker = registerEvent(elements.clock, "mousedown", e => this.createTracker(e));
    }

    mouseTracker: MouseTracker | null = null;
    createTracker(e: MouseEvent) {
        this.hours.refreshOffsets();
        this.minutes.refreshOffsets();

        this.setTime(e);

        if (this.mouseTracker) return;
        var mouseTracker = this.mouseTracker = new MouseTracker();

        mouseTracker.onMouseUp(() => {
            mouseTracker.dispose();
            if (mouseTracker === this.mouseTracker) this.mouseTracker = null;

            if (this.hours.getVisible()) {
                this.minutes.normalizeAngle(this.hours.value.angle);
                this.hand.setPositon(this.minutes.value.angle, this.minutes.value.position);
                this.hours.hide();
                this.minutes.show();
            }
        });

        mouseTracker.onMouseMove(e => this.setTime(e));
    }

    setTime(e: MouseEvent) {
        if (this.hours.getVisible()) {
            this.hours.set(e.clientX, e.clientY);
            this.hand.setPositon(this.hours.value.angle, this.hours.value.position);
        } else {
            this.minutes.set(e.clientX, e.clientY);
            this.hand.setPositon(this.minutes.value.angle, this.minutes.value.position);
        }
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