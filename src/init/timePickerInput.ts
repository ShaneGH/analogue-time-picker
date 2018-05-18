import { parseTime, timeToString } from '../utils/time';
import { registerEvent } from '../utils/utils';
import { CommonData, InitializeTimeData, parseMode, parseTimeInput, parseTimeValues } from './parseInputs';
import { create as modal } from './timePickerModal';
import { Clock } from './publicClock';

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

    var clock: Clock | null = null;
    var el = input.inputElement;    
    var displayModal = () => {
        clock = modal({
            mode: input.mode,
            width: input.width,
            time: parseTime(el.value) as any
        });

        clock.onOk((h: number, m: number) => {
            // assuming that the timePickerModal call will have validated the mode
            el.value = timeToString(h, m, <any>input.mode || 24);
        });

        clock.onDispose(() => clock = null);
    }

    var dispose = [
        registerEvent(el, "focus", displayModal),

        // prevent use input on input
        registerEvent(el, "keyup", e => e.preventDefault()),
        registerEvent(el, "keydown", e => e.preventDefault()),
        registerEvent(el, "keypress", e => e.preventDefault())
    ];

    var mode: (12 | 24) = parseMode(input.mode);
    if (input.time) {
        var t = parseTimeInput(input.time);
        el.value = timeToString(t.hour, t.minute, mode);
    }
    
    if (document.activeElement === el) displayModal();

    return {
        getTime: () => {
            if (clock) return clock.getTime();
            return parseTime(el.value || "");
        },
        setTime: (hour: object, minute: object, force = false) => {
            if (clock) {
                clock.setTime(hour, minute);
            }

            if (!clock || force) {
                var time = parseTimeValues(hour, minute);
                el.value = timeToString(time.hour, time.minute, mode);
            }
        },
        dispose: () => {
            if (clock) clock.dispose();
            
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