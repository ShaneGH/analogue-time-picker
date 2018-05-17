import { parseTime, timeToString } from '../utils/time';
import { registerEvent } from '../utils/utils';
import { CommonData, InitializeTimeData, parseMode, parseTimeInput } from './parseInputs';
import { create as modal } from './timePickerModal';

/** The inputs for a new clock, which launches when an input receives focus */
type TimePickerInputData = CommonData & InitializeTimeData &
    {
        /** The input element */
        inputElement?: object
    }

/** Create a new time picker and render in a modal each time an input is focused */
function create(input?: TimePickerInputData) {
    if (!input || !(input.inputElement instanceof HTMLInputElement)) {
        throw new Error("The inputElement must be a html input element");
    }

    var el = input.inputElement;    
    var displayModal = () => {
        var clock = modal({
            mode: input.mode,
            width: input.width,
            time: parseTime(el.value) as any
        });

        clock.onOk((h: number, m: number) => {
            // assuming that the timePickerModal call will have validated the mode
            el.value = timeToString(h, m, <any>input.mode || 24);
        });
    }

    var dispose = [
        registerEvent(el, "focus", displayModal),

        // prevent use input on input
        registerEvent(el, "keyup", e => e.preventDefault()),
        registerEvent(el, "keydown", e => e.preventDefault()),
        registerEvent(el, "keypress", e => e.preventDefault())
    ];

    if (document.activeElement === el) displayModal();

    if (input.time) {
        var t = parseTimeInput(input.time);
        var mode: (12 | 24) = parseMode(input.mode);
        el.value = timeToString(t.hour, t.minute, mode);
    }

    return {
        dispose: () => {
            dispose
                .splice(0, Number.MAX_VALUE)
                .forEach(f => f());
        }
    };
}

export {
    TimePickerInputData,
    create
}