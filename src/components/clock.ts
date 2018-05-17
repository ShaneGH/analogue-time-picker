import { registerMouseEvent, registerTouchEvent } from '../utils/utils';
import { GestureTracker } from './gestureTracker';
import { Hand } from './hand';
import { Hours } from './hours';
import { Minutes } from './minutes';

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

/**The clock component which contains all other components */
class Clock {
    ok: HTMLElement
    cancel: HTMLElement
    clock: HTMLElement

    _createMouseTracker: () => void
    _createTouchTracker: () => void
    _okPropagation: () => void
    _cancelPropagation: () => void
    _ok: () => void
    _cancel: () => void

    constructor(elements: Elements, public hours: Hours, public minutes: Minutes, public hand: Hand, mode: 12 | 24) {

        this.ok = elements.okButton;
        this.cancel = elements.cancelButton;
        this.clock = elements.clock;

        // register events for when something happens with the "hours"
        this.hours.onNext(() => this.showMinutes());
        this.hours.onRenderValuesChanged(() => this.hourChangeOccurred());
        this.hours.onInputFocus(() => this.showHours());

        // register events for when something happens with the "minutes"
        this.minutes.onNext(() => this.ok.focus());
        this.minutes.onPrevious(() => this.showHours());
        this.minutes.onRenderValuesChanged(() => this.minuteChangeOccurred());
        this.minutes.onInputFocus(() => this.showMinutes());

        // show hours be default
        this.showHours();

        // register dom events on clock face, ok and cancel buttons
        this._createMouseTracker = registerMouseEvent(this.clock, "mousedown", e => this.createMouseTracker(e));
        this._createTouchTracker = registerTouchEvent(this.clock, "touchstart", e => this.createTouchTracker(e));

        this._okPropagation = registerMouseEvent(this.ok, "mousedown", e => e.stopPropagation());
        this._cancelPropagation = registerMouseEvent(this.cancel, "mousedown", e => e.stopPropagation());
        this._ok = registerMouseEvent(this.ok, "click", () => this.okClick());
        this._cancel = registerMouseEvent(this.cancel, "click", () => this.cancelClick());

        this.setMode(mode);
    }

    _timeChangeCallbacks: ((hour: number, minute: number) => void)[] = [];

    /**Add a callback to be fired when the time changes */
    onTimeChanged(callback: ((hour: number, minute: number) => void)) {
        this._timeChangeCallbacks.push(callback);
    }

    _okCallbacks: ((hour: number, minute: number) => void)[] = [];
    
    /**Add a callback to be fired when the user is finished */
    onOk(callback: ((hour: number, minute: number) => void)) {
        this._okCallbacks.push(callback);
    }

    _cancelCallbacks: (() => void)[] = [];
    
    /**Add a callback to be fired when the cancels */
    onCancel(callback: (() => void)) {
        this._cancelCallbacks.push(callback);
    }

    /**Set the format to 12h or 24h for the user */
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

    /** Show the hour hand */
    showHours() {
        this.hours.focus();
        this.minutes.blur();
        this.hand.setPositon(this.hours.value.angle, this.hours.value.position);
    }

    /**Show the minute hand */
    showMinutes() {
        this.minutes.normalizeAngle(this.hours.value.angle);
        this.minutes.focus();
        this.hours.blur();
        this.hand.setPositon(this.minutes.value.angle, this.minutes.value.position);
    }

    /** Return the current time */
    getTime() {
        return {
            hour: this.hours.value.value,
            minute: this.minutes.value.value
        };
    }

    /** Set the current time */
    setTime(hours: number, minutes: number) {
        var timeHasChanged = this._suppressTimeChangeEvents();
        try {
            this.hours.set(hours);
            this.minutes.set(minutes);
        } finally {
            timeHasChanged.complete();
        }
    }

    private hourChangeOccurred() {
        if (this.hours.getFocused())
            this.hand.setPositon(this.hours.value.angle, this.hours.value.position);

        this.timeChangeOccurred();
    }

    private minuteChangeOccurred() {
        if (this.minutes.getFocused())
            this.hand.setPositon(this.minutes.value.angle, this.minutes.value.position);

        this.timeChangeOccurred();
    }

    private timeChangeOccurred() {
        if (this._timeChangeSuppressed) return;

        this._timeChangeCallbacks
            .slice(0)
            .forEach(f => f(this.hours.value.value, this.minutes.value.value));
    }

    /**Signify that the user is finished */
    okClick() {
        this._okCallbacks
            .slice(0)
            .forEach(f => f(this.hours.value.value, this.minutes.value.value));
    }

    /**Signify that the user has cancelled */
    cancelClick() {
        this._cancelCallbacks
            .slice(0)
            .forEach(f => f());
    }

    private _timeChangeSuppressed: {hour: number, minute: number, instance: number} | null
    
    /** Specify that the time may change, and to supress change events if it does.
     * When the returned "compltete" function is called, events are re-enabled, and one may be
     * fired immediately if the time has changed while evets were disabled*/
    private _suppressTimeChangeEvents() {

        // if events already suppressed, signify that
        // one more "supressor" is active
        if (this._timeChangeSuppressed) {
            this._timeChangeSuppressed.instance++;
        } else {
            this._timeChangeSuppressed = {
                instance: 1,
                ...this.getTime()   // TODO: do we need to watch hand angle/position here too?
            }
        };

        var c = false;
        return {
            complete: () => {
                if (c) return;
                c = true;

                if (!this._timeChangeSuppressed) return;
                else if (this._timeChangeSuppressed.instance > 1) this._timeChangeSuppressed.instance--;
                else {
                    // if time has changed, fire event if necessary
                    var t1 = this._timeChangeSuppressed;
                    this._timeChangeSuppressed = null;

                    var t2 = this.getTime();
                    if (t1.hour != t2.hour || t1.minute != t2.minute) {
                        this.timeChangeOccurred();
                    }
                }
            }
        };
    }

    mouseTracker: GestureTracker<MouseEvent> | null = null;
    /** Create an object to track the mousemove on the entire screen */
    createMouseTracker(e: MouseEvent) {
        // touch takes precedence over mouse
        if (this.touchTracker) return;

        // use this as an opportunity to see if the clock html element has moved
        this.hours.refreshOffsets();
        this.minutes.refreshOffsets();

        // Set the current hours or minutes
        this.setTimeFromPosition(e.clientX, e.clientY);

        // create a new tracker
        if (this.mouseTracker) return;
        var mouseTracker = this.mouseTracker = new GestureTracker<MouseEvent>(["mousemove"], ["mouseup"]);

        // dispose when mouse released
        mouseTracker.onFinished(() => {
            mouseTracker.dispose();
            if (mouseTracker === this.mouseTracker) this.mouseTracker = null;

            this.hours.getFocused() ?
                this.hours.goNext() :
                this.minutes.goNext();
        });

        mouseTracker.onMove(e => this.setTimeFromPosition(e.clientX, e.clientY));
    }

    touchTracker: GestureTracker<TouchEvent> | null = null;
    /** Create an object to track the touchmove over the entire screen */
    createTouchTracker(e: TouchEvent) {
        // touch takes precedence over mouse
        if (this.mouseTracker) {
            this.mouseTracker.dispose();
            this.mouseTracker = null;
        }
        
        // prevent scrolling
        e.preventDefault();

        // use this as an opportunity to see if the clock html element has moved
        this.hours.refreshOffsets();
        this.minutes.refreshOffsets();

        // Set the current hours or minutes
        if (e.touches.length) {
            this.setTimeFromPosition(e.touches[0].clientX, e.touches[0].clientY);
        }

        // create a new tracker
        if (this.touchTracker) return;
        var touchTracker = this.touchTracker = new GestureTracker<TouchEvent>(["touchmove"], ["touchend", "touchcancel"]);

        // dispose when touch released
        touchTracker.onFinished(() => {
            touchTracker.dispose();
            if (touchTracker === this.touchTracker) this.touchTracker = null;

            this.hours.getFocused() ?
                this.hours.goNext() :
                this.minutes.goNext();
        });

        touchTracker.onMove(e => {
            // prevent scrolling
            e.preventDefault();
            if (e.touches.length) {
                this.setTimeFromPosition(e.touches[0].clientX, e.touches[0].clientY);
            }
        });
    }

    private setTimeFromPosition(clientX: number, clientY: number) {
        this.hours.getFocused() ?
            this.hours.setFromPosition(clientX, clientY) :
            this.minutes.setFromPosition(clientX, clientY);
    }
    
    dispose() {

        if (this.mouseTracker) {
            this.mouseTracker.dispose();
            this.mouseTracker = null;
        }
        
        this._timeChangeCallbacks.length = 0;
        this._okCallbacks.length = 0;
        this._cancelCallbacks.length = 0;
        
        this._createMouseTracker();
        this._createTouchTracker();
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