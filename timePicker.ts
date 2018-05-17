import { TimeInput } from './src/clock';
import { enable } from './src/css';
import { DiContext } from './src/di';
import { publicClock } from './src/publicClock';
import { defaultMode } from './src/time';
import { createModal } from "./src/html"

// add css
enable();

/** Common inputs for all time picker types */
type CommonInputs =
    {
        /** The initial time to show. If a Date is used, it's "getHours()" and "getMinutes()" functions will be called to get the time */
        time?: {
            /** The hour in 24hour format. 24 is not a valid hour, use 0 instead */
            hour?: object, 
            /** The minute */
            minute?: object
        } | Date,
    
        /** Specify a 12 or 24 hour clock. If not specified, the user browser default will be used.
         * If the clock is in 12h mode, the times used as inputs, in getTime, setTime and onOk will still be in 24h format  */
        mode?: object,
    
        /** The width of the component. Default 300px. If set, will also ajust the font-size.
         * If a % value is used, the control will grow to fit parent element size. In this case, font-size must also be set on the parent.
         * If an em value is used, the font-size will be un altered. This may have some unexpected outcomes. */
        width?: object
    }

/** The inputs for a new clock. Inputs are objects to force input validation */
type TimePickerInput = CommonInputs & 
{
    /** The element to create the clock inside. If not specified, a new div will be created */
    element?: object
}

function parseInputs(input?: TimePickerInput) {

    if (!input) input = {};

    var element: HTMLElement | undefined;
    var time: TimeInput = {hour: 0, minute: 0};
    var mode: 12 | 24;
    var width: string;

    if (input.element) {
        if (input.element instanceof HTMLElement) {
            element = input.element;
        } else {
            throw new Error("The element propery must be a html element, or undefined.");
        }
    }

    mode = defaultMode;
    if (input.mode != null) {
        var md = parseInt(input.mode as any);
        if (md === 12) mode = 12;
        else if (md === 24) mode = 24;
        else throw new Error("The mode argument must be null, undefined, 12 or 24.");
    }

    if (input.time != null) {
        if (input.time instanceof Date) {
            time.hour = input.time.getHours();
            time.minute = input.time.getMinutes();
        } else {
            if (input.time.hour != null) {
                var h = parseInt(input.time.hour as any);
                if (isNaN(h) || h < 0 || h > 23) {
                    throw new Error(`The time.hour (${input.time.hour}) argument must be between 0 and 23.`);
                } else {
                    time.hour = h
                }
            }
            
            if (input.time.minute != null) {
                var m = parseInt(input.time.minute as any);
                if (isNaN(m) || m < 0 || m > 59) {
                    throw new Error(`The time.minute (${input.time.minute}) argument must be between 0 and 59.`);
                } else {
                    time.minute = m
                }
            }
        }
    }

    width = "300px";
    if (input.width != null) {
        if (typeof input.width === "number") {
            width = `${input.width}px`;
        } else if (typeof input.width === "string") {
            width = input.width;
        } else {
            throw new Error(`The width (${input.width}) argument must be a number or string.`);
        }
    }

    return {
        config: {
            time,
            mode,
            width
        },
        element
    };
}

/** Create a new time picker and render as a modal */
function timePickerModal(input?: CommonInputs) {
    if (input && (<TimePickerInput>input).element) {
        throw new Error("You cannot specify a container element when rendering in a modal.");
    }

    var p = timePicker(input);
    var disposeModal = createModal(p.element);
    disposeModal.onClickOrEsc(() => p.cancel());
    p.onDispose(disposeModal.dispose);
    return p;
}

/** Create a new time picker. The timepicker lives in the "element" return value which can then be appended to the DOM */
function timePicker(input?: TimePickerInput) {
    var _input = parseInputs(input);
    
    var context = new DiContext(_input.config, _input.element);
    return publicClock(context);
}

export {
    CommonInputs,
    TimePickerInput,
    timePicker,
    timePickerModal
}