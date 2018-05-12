import { Hand } from './hand';
import { Hours } from './hours';
import { Minutes } from './minutes';
import { MouseTracker } from './mouseTracker';
import { registerMouseEvent } from './utils';;

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

    _createTracker: (() => void)
    _okPropagation: (() => void)
    _cancelPropagation: (() => void)
    _ok: (() => void)
    _cancel: (() => void)

    constructor(elements: Elements, public hours: Hours, public minutes: Minutes, public hand: Hand, public closeOnSelect: boolean) {

        this.ok = elements.okButton;
        this.cancel = elements.cancelButton;
        this.clock = elements.clock;

        this.hours.show();
        this.minutes.hide();
        this.hand.setPositon(this.hours.value.angle, this.hours.value.position);
        this.hours.numberInput.onNext(() => this.minutes.numberInput.focus());
        this.minutes.numberInput.onNext(() => this.ok.focus());

        this._createTracker = registerMouseEvent(this.clock, "mousedown", e => this.createTracker(e));
        this._okPropagation = registerMouseEvent(this.ok, "mousedown", e => e.stopPropagation());
        this._cancelPropagation = registerMouseEvent(this.cancel, "mousedown", e => e.stopPropagation());
        this._ok = registerMouseEvent(this.ok, "click", () => this.okClick());
        this._cancel = registerMouseEvent(this.cancel, "click", () => this.cancelClick());
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

        if (this.mouseTracker) {
            this.mouseTracker.dispose();
            this.mouseTracker = null;
        }
        
        var callbacks = this._disposeCallbacks;
        
        this._disposeCallbacks = [];
        this._timeChangeCallbacks = [];
        this._okCallbacks = [];
        this._cancelCallbacks = [];
        
        this._createTracker();
        this._okPropagation();
        this._cancelPropagation();
        this._ok();
        this._cancel();
        
        callbacks
            .slice(0)
            .forEach(f => f());
    }
}

export {
    Clock,
    TimeInput
}