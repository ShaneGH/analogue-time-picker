import { Hand } from './hand';
import { Hours } from './hours';
import { Minutes } from './minutes';
import { MouseTracker } from './mouseTracker';
import { registerMouseEvent } from './utils';

type TimeInput =
    {
        hour: number
        minute: number
    }

type Elements =
    {
        clock: HTMLElement
        okButton: HTMLElement
        cancelButton: HTMLElement
    }

class Clock {
    ok: HTMLElement
    cancel: HTMLElement
    clock: HTMLElement

    _createTracker: () => void
    _okPropagation: () => void
    _cancelPropagation: () => void
    _ok: () => void
    _cancel: () => void

    constructor(elements: Elements, public hours: Hours, public minutes: Minutes, public hand: Hand, closeOnSelect: boolean, mode: 12 | 24) {

        this.ok = elements.okButton;
        this.cancel = elements.cancelButton;
        this.clock = elements.clock;

        this.hours.onNext(() => this.showMinutes());
        this.hours.onRenderValuesChanged(() => this.hourChangeOccurred());
        this.hours.onInputFocus(() => this.showHours());

        this.minutes.onNext(() => closeOnSelect ? this.okClick() : this.ok.focus());
        this.minutes.onPrevious(() => this.showHours());
        this.minutes.onRenderValuesChanged(() => this.minuteChangeOccurred());
        this.minutes.onInputFocus(() => this.showMinutes());

        this.showHours();

        this._createTracker = registerMouseEvent(this.clock, "mousedown", e => this.createTracker(e));
        this._okPropagation = registerMouseEvent(this.ok, "mousedown", e => e.stopPropagation());
        this._cancelPropagation = registerMouseEvent(this.cancel, "mousedown", e => e.stopPropagation());
        this._ok = registerMouseEvent(this.ok, "click", () => this.okClick());
        this._cancel = registerMouseEvent(this.cancel, "click", () => this.cancelClick());

        this.setMode(mode);
    }

    _timeChangeCallbacks: ((hour: number, minute: number) => void)[] = [];
    onTimeChanged(callback: ((hour: number, minute: number) => void)) {
        this._timeChangeCallbacks.push(callback);
    }

    _okCallbacks: ((hour: number, minute: number) => void)[] = [];
    onOk(callback: ((hour: number, minute: number) => void)) {
        this._okCallbacks.push(callback);
    }

    _cancelCallbacks: (() => void)[] = [];
    onCancel(callback: (() => void)) {
        this._cancelCallbacks.push(callback);
    }

    setMode(mode: 12 | 24) {
        switch (mode) {
            case 12:
                this.hours.setTo12Hr();
                break;
            case 24:
                this.hours.setTo24Hr();
                break;
        }
    }

    showHours() {
        this.hours.show();
        this.minutes.hide();
        this.hand.setPositon(this.hours.value.angle, this.hours.value.position);
    }

    showMinutes() {
        this.minutes.normalizeAngle(this.hours.value.angle);
        this.minutes.show();
        this.hours.hide();
        this.hand.setPositon(this.minutes.value.angle, this.minutes.value.position);
    }

    getTime() {
        return {
            hour: this.hours.value.value,
            minute: this.minutes.value.value
        };
    }

    setTime(hours: number, minutes: number) {
        var timeHasChanged = this._timeMayChange();
        try {
            this.hours.set(hours);
            this.minutes.set(minutes);
        } finally {
            timeHasChanged.complete();
        }
    }

    hourChangeOccurred() {
        if (this.hours.getVisible())
            this.hand.setPositon(this.hours.value.angle, this.hours.value.position);

        this.timeChangeOccurred();
    }

    minuteChangeOccurred() {
        if (this.minutes.getVisible())
            this.hand.setPositon(this.minutes.value.angle, this.minutes.value.position);

        this.timeChangeOccurred();
    }

    timeChangeOccurred() {
        if (this._awaitingTimeChange) return;

        this._timeChangeCallbacks
            .slice(0)
            .forEach(f => f(this.hours.value.value, this.minutes.value.value));
    }

    okClick() {
        this._okCallbacks
            .slice(0)
            .forEach(f => f(this.hours.value.value, this.minutes.value.value));
    }

    cancelClick() {
        this._cancelCallbacks
            .slice(0)
            .forEach(f => f());
    }

    private _awaitingTimeChange: {hour: number, minute: number, instance: number} | null
    private _timeMayChange() {

        if (this._awaitingTimeChange) {
            this._awaitingTimeChange.instance++;
        } else {
            this._awaitingTimeChange = {
                instance: 1,
                ...this.getTime()
            }
        };

        var c = false;
        return {
            complete: () => {
                if (c) return;
                c = true;

                if (!this._awaitingTimeChange) return;
                else if (this._awaitingTimeChange.instance > 1) this._awaitingTimeChange.instance--;
                else {
                    var t1 = this._awaitingTimeChange;
                    this._awaitingTimeChange = null;

                    var t2 = this.getTime();
                    if (t1.hour != t2.hour || t1.minute != t2.minute) {
                        this.timeChangeOccurred();
                    }
                }
            }
        };
    }

    mouseTracker: MouseTracker | null = null;
    createTracker(e: MouseEvent) {
        this.hours.refreshOffsets();
        this.minutes.refreshOffsets();

        this.setTimeFromPosition(e);

        if (this.mouseTracker) return;
        var mouseTracker = this.mouseTracker = new MouseTracker();

        mouseTracker.onMouseUp(() => {
            mouseTracker.dispose();
            if (mouseTracker === this.mouseTracker) this.mouseTracker = null;

            this.hours.getVisible() ?
                this.hours.goNext() :
                this.minutes.goNext();
        });

        mouseTracker.onMouseMove(e => this.setTimeFromPosition(e));
    }

    private setTimeFromPosition(e: MouseEvent) {
        this.hours.getVisible() ?
            this.hours.setFromPosition(e.clientX, e.clientY) :
            this.minutes.setFromPosition(e.clientX, e.clientY);
    }
    
    dispose() {

        if (this.mouseTracker) {
            this.mouseTracker.dispose();
            this.mouseTracker = null;
        }
        
        this._timeChangeCallbacks.length = 0;
        this._okCallbacks.length = 0;
        this._cancelCallbacks.length = 0;
        
        this._createTracker();
        this._okPropagation();
        this._cancelPropagation();
        this._ok();
        this._cancel();
    }
}

export {
    Clock,
    TimeInput
}