import { TimeInput } from './src/clock';
import { DiContext } from './src/di';
import { publicClock } from './src/publicClock';
import { append, create, remove } from './src/template';
import { enable } from './src/css';
import { defaultMode } from './src/time';

// add css
enable();

type Input =
    {
        element?: object, 
        time?: {hour: object | null, minute: object | null} | Date,
        closeOnSelect?: boolean,
        mode?: object
    }

function parseInputs(input?: Input) {

    if (!input) input = {};

    var element: HTMLElement | undefined;
    var time: TimeInput = {hour: 0, minute: 0};
    var mode: 12 | 24;

    if (input.element) {
        if (input.element instanceof HTMLElement) {
            element = input.element;
        } else {
            throw new Error("The element propery must be a html element, or undefined.");
        }
    }

    mode = defaultMode;
    if (input.mode != null) {
        if (typeof input.mode !== "number") {
            throw new Error("The mode argument must be null, undefined, 12 or 24.");
        }

        if (input.mode === 12) mode = 12;
        else if (input.mode === 24) mode = 24;
        else throw new Error("The mode argument must be null, undefined, 12 or 24.");
    }

    if (input.time != null) {
        if (input.time instanceof Date) {
            time.hour = input.time.getHours();
            time.minute = input.time.getMinutes();
        } else {
            if (input.time.hour != null) {
                if (typeof input.time.hour === "number") {
                    if (input.time.hour < 0 || input.time.hour > 23) throw new Error("The time.hour argument must be between 1 and 24.");
                    time.hour = input.time.hour;
                } else {
                    throw new Error("The time.hour argument must be a number.");
                }
            }
            
            if (input.time.minute != null) {
                if (typeof input.time.minute === "number") {
                    if (input.time.minute < 0 || input.time.minute > 59) throw new Error("The time.minute argument must be between 0 and 59.");
                    time.minute = input.time.minute;
                } else {
                    throw new Error("The time.minute argument must be a number.");
                }
            }
        }
    }

    return {
        config: {
            time, 
            closeOnSelect: !!input.closeOnSelect,
            mode
        },
        element
    };
}

function materialTimeLite(input?: Input) {
    var _input = parseInputs(input);
    
    var context = new DiContext(_input.config, _input.element);
    return publicClock(context);
}

export {
    materialTimeLite
}