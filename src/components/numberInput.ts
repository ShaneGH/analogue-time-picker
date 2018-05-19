import { keyPressDetails } from '../utils/numberKeyPressInterpreters';
import { registerKeyEvent } from '../utils/utils';

/** Component to manage the number number textbox (e.g. the hour/minute) */
abstract class NumberInput {

    _keyPressHandler: () => void
    _focusHandler: () => void

    protected value = 0
    constructor(public input: HTMLInputElement) {
        this._keyPressHandler = registerKeyEvent(input, "keydown", e => this.keyDown(e));
        this._focusHandler = registerKeyEvent(input, "focus", e => this.focusOnInput());
    }

    _onFocus: (() => void)[] = []
    
    /**Callback for when element receives focus */
    onFocus(f: () => void) {
        this._onFocus.push(f);
    }

    _onNextCallbacks: (() => void)[] = []
    
    /**Callback for when element is complete (like tab) */
    onNext(f: () => void) {
        this._onNextCallbacks.push(f);
    }

    _onPreviousCallbacks: (() => void)[] = []
    
    /**Callback for when element is complete (like shift tab) */
    onPrevious(f: () => void) {
        this._onPreviousCallbacks.push(f);
    }
    
    _timeChangedCallbacks: ((value: number) => void)[] = [];
    
    /**Callback for when value in the textbox has changed  */
    onTimeChanged(callback: ((value: number) => void)) {
        this._timeChangedCallbacks.push(callback);
    }

    protected abstract getMaxValue(): number

    private keyDown(e: KeyboardEvent) {
        var details = keyPressDetails(this.input, e, this.getMaxValue());
        
        if (details.handled) e.preventDefault();
        if (details.value != null) {
            this._set(details.value);
        }

        if (details.nextPosition != null) {
            if (details.nextPosition < 0) {
                this._onPreviousCallbacks.forEach(f => f());
            } else {
                this.input.selectionEnd = details.nextPosition;
                this.input.selectionStart = details.nextPosition;
                if (details.nextPosition > 1) {
                    this._onNextCallbacks.forEach(f => f());
                }
            }
        }
    }

    private focusOnInput() {
        this._onFocus
            .slice(0)
            .forEach(f => f());
    }

    /** Set a value in the textbox */
    set(value: number) {
        if (value < 0 || value > this.getMaxValue()) throw new Error(`Invalid value "${value}"`);
        this._set(parseInt(value.toFixed()));
    }

    private _set(value: number) {
        var changed = this.value !== value;

        this.value = value;
        this.input.value = this.transformInputValue(value);

        if (changed) {
            this._timeChangedCallbacks
                .slice(0)
                .forEach(f => f(value));
        }
    }

    abstract transformInputValue(value: number): string

    /**
     * @param {boolean} [focusInput=true] If true, will focus the cursor on the input also
     */
    focus(focusInput = true) {
        this.input.classList.add("atp-focus");
        if (focusInput) {
            this.input.focus();
            this.input.selectionStart = 0;
            this.input.selectionEnd = 0;
        }
    }

    blur() {
        this.input.classList.remove("atp-focus");
    }

    dispose() {
        this._focusHandler();
        this._keyPressHandler();
        
        this._onFocus.length = 0;
        this._onPreviousCallbacks.length = 0;
        this._onNextCallbacks.length = 0;
        this._timeChangedCallbacks.length = 0;
    }
}

export {
    NumberInput
}