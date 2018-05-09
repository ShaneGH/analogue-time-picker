import { Clock, TimeInput } from "./src/clock";
import { create, append } from "./src/template";
import { buildElements } from "./src/componentElements";

// requiring will auto inject via webpack style-loader
declare var require: any
const css = require('./src/clock.css');

function simpleMaterialTime(element?: object, time?: {hour: object | null, minute: object | null} | Date) {

    var _element: HTMLElement;
    var _time: TimeInput = {hour: null, minute: null};

    if (element == null) {
        _element = create();
    } else if (!(element instanceof HTMLElement)) {
        throw new Error("The input argument must be a html element.");
    } else {
        _element = append(element);
    }

    if (time != null) {
        if (time instanceof Date) {
            _time.hour = time.getHours();
            _time.minute = time.getMinutes();
        } else {
            if (time.hour != null) {
                if (typeof time.hour === "number") {
                    if (time.hour < 1 || time.hour > 24) throw new Error("The time.hour argument must be between 1 and 24.");
                    _time.hour = time.hour;
                } else {
                    throw new Error("The time.hour argument must be a number.");
                }
            }
            
            if (time.minute != null) {
                if (typeof time.minute === "number") {
                    if (time.minute < 0 || time.minute > 59) throw new Error("The time.minute argument must be between 0 and 59.");
                    _time.minute = time.minute;
                } else {
                    throw new Error("The time.minute argument must be a number.");
                }
            }
        }
    }

    return {
        element: _element,
        clock: new Clock(buildElements(_element), _time)
    };
}

export {
    simpleMaterialTime
}