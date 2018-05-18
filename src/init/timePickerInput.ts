import { parseTime, timeToString } from '../utils/time';
import { registerEvent } from '../utils/utils';
import { CommonData, InitializeTimeData, parseMode, parseTimeInput, parseTimeValues } from './parseInputs';
import { create as createModal } from './timePickerModal';
import { TimePicker } from './publicTimePicker';

/** The results of a timepicker input */
type TimePickerInput =
    {
        getTime: () => {hour: number, minute: number},
        setTime: (hour: object, minute: object, force?: boolean) => void,
        dispose:  () => void,
    }

/** The inputs for a new time picker, which launches when an input receives focus */
type TimePickerInputData = CommonData & InitializeTimeData &
    {
        /** The input element */
        inputElement?: object
    }

/** Create a new time picker and render in a modal each time an input is focused */
function create(input?: TimePickerInputData): TimePickerInput {
    if (!input || !(input.inputElement instanceof HTMLInputElement)) {
        throw new Error("The inputElement must be a html input element");
    }

    var modal: TimePicker | null = null;
    var el = input.inputElement;    
    var displayModal = () => {
        modal = createModal({
            mode: input.mode,
            width: input.width,
            time: parseTime(el.value) as any
        });

        modal.onOk((h: number, m: number) => {
            // assuming that the timePickerModal call will have validated the mode
            el.value = timeToString(h, m, <any>input.mode || 24);
        });

        modal.onDispose(() => modal = null);
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
            if (modal) return modal.getTime();
            return parseTime(el.value || "");
        },
        setTime: (hour: object, minute: object, force = false) => {
            if (modal) {
                modal.setTime(hour, minute);
            }

            if (!modal || force) {
                var time = parseTimeValues(hour, minute);
                el.value = timeToString(time.hour, time.minute, mode);
            }
        },
        dispose: () => {
            if (modal) modal.dispose();

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