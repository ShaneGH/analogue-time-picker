import { registerMouseEvent } from "./utils";
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
// import { TimeDisplay } from "./timeDisplay";

type TimeInput =
    {
        hour: number | null
        minute: number | null
    }

class Clock {
    hours: Hours
    minutes: Minutes
    hand: Hand
    // time: TimeDisplay

    ok: HTMLElement
    cancel: HTMLElement

    _createTracker: (() => void) | null = null;
    _okPropagation: (() => void) | null = null;
    _cancelPropagation: (() => void) | null = null;
    _ok: (() => void) | null = null;
    _cancel: (() => void) | null = null;

    constructor(elements: Elements, public closeOnSelect: boolean, time?: TimeInput) {

        this.ok = elements.ok;
        this.cancel = elements.cancel;

        var hr = time ? time.hour || 0 : 0;
        this.hours = new Hours({
            containerElement: elements.hourContainer,
            numbers: elements.hours,
            numberInput: elements.hoursTextbox
        }, hr, true);

        var min = time ? time.minute || 0 : 0;
        this.minutes = new Minutes({
            containerElement: elements.minuteContainer,
            numbers: elements.minutes,
            numberInput: elements.minutesTextbox
        }, min, false);

        this.hand = new Hand(elements, this.hours.value.angle, this.hours.value.position);
        // this.time = new TimeDisplay(elements.hoursTextbox, elements.minutesTextbox, elements.ok);
        // this.time.setTime(this.hours.value.value, this.minutes.value.value);

        this._createTracker = registerMouseEvent(elements.clock, "mousedown", e => this.createTracker(e));
        this._okPropagation = registerMouseEvent(elements.ok, "mousedown", e => e.stopPropagation());
        this._cancelPropagation = registerMouseEvent(elements.cancel, "mousedown", e => e.stopPropagation());
        this._ok = registerMouseEvent(elements.ok, "click", () => this.okClick());
        this._cancel = registerMouseEvent(elements.cancel, "click", () => this.cancelClick());

        // this.onTimeChanged((h, m) => this.time.setTime(h, m));
        // this.time.onTimeChanged((h, m) => this.s .setTime(h, m));
    }

    _timeChangeCallbacks: ((hour: number, minute: number) => void | boolean)[] = [];
    onTimeChanged(callback: ((hour: number, minute: number) => void | boolean)) {
        this._timeChangeCallbacks.push(callback);
    }

    timeChangeOccurred() {
        this._timeChangeCallbacks
            .slice(0)
            .forEach(f => f(this.hours.value.value, this.minutes.value.value));
    }

    _okCallbacks: ((hour: number, minute: number) => void | boolean)[] = [];
    onOk(callback: ((hour: number, minute: number) => void | boolean)) {
        this._okCallbacks.push(callback);
    }

    okClick() {
        var cancelDispose = this._okCallbacks
            .slice(0)
            .map(f => f(this.hours.value.value, this.minutes.value.value))
            .filter(r => r === false)
            .length;

        if (!cancelDispose) this.dispose();
    }

    _cancelCallbacks: (() => void | boolean)[] = [];
    onCancel(callback: (() => void | boolean)) {
        this._cancelCallbacks.push(callback);
    }

    cancelClick() {
        var cancelDispose = this._cancelCallbacks
            .slice(0)
            .map(f => f())
            .filter(r => r === false)
            .length;

        if (!cancelDispose) this.dispose();
    }

    _disposeCallbacks: (() => void)[] = [];
    onDispose(callback: (() => void)) {
        this._disposeCallbacks.push(callback);
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
            } else if (this.closeOnSelect) {
                this.okClick();
            } else {
                this.ok.focus();
            }
        });

        mouseTracker.onMouseMove(e => this.setTime(e));
    }

    setTime(e: MouseEvent) {
        if (this.hours.getVisible()) {
            if (this.hours.setFromPosition(e.clientX, e.clientY)) {
                this.timeChangeOccurred();
            }

            this.hand.setPositon(this.hours.value.angle, this.hours.value.position);
        } else {
            if (this.minutes.setFromPosition(e.clientX, e.clientY)) {
                this.timeChangeOccurred();
            }

            this.hand.setPositon(this.minutes.value.angle, this.minutes.value.position);
        }
    }
    
    dispose() {
        // this.time.dispose();

        if (this.mouseTracker) {
            this.mouseTracker.dispose();
            this.mouseTracker = null;
        }
        
        if (this._createTracker) {
            this._createTracker();
            this._createTracker = null;
        }
        
        if (this._okPropagation) {
            this._okPropagation();
            this._okPropagation = null;
        }
        
        if (this._cancelPropagation) {
            this._cancelPropagation();
            this._cancelPropagation = null;
        }

        this._timeChangeCallbacks = [];
        
        this._okCallbacks = [];
        if (this._ok) {
            this._ok();
            this._ok = null;
        }
        
        this._cancelCallbacks = [];
        if (this._cancel) {
            this._cancel();
            this._cancel = null;
        }
        
        var callbacks = this._disposeCallbacks;
        this._cancelCallbacks = [];
        callbacks
            .slice(0)
            .forEach(f => f());
    }
}

export {
    Clock,
    TimeInput
}