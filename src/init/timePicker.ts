import { DiContext } from '../di';
import { CommonData, InitializeTimeData, parseHtmlElement, parseMode, parseTimeInput, parseWidth } from './parseInputs';
import { publicTimePicker } from './publicTimePicker';

/** The inputs for a new time picker */
type TimePickerData = CommonData & InitializeTimeData &
    {
        /** The element to create the time picker inside. If not specified, a new div will be created */
        element?: object
        
        /** If set to true, the "hours" input will be focused on render. Default false */
        focus?: object
    }

function parseTimePickerData(input?: TimePickerData) {

    if (!input) input = {};
    return {
        config: {
            time: parseTimeInput(input.time),
            mode: parseMode(input.mode) as (12 | 24),
            width: parseWidth(input.width),
            focusOnInput: !!input.focus
        },
        element: parseHtmlElement(input.element)
    };
}

/** Create a new time picker. The timepicker lives in the "element" return value which can then be appended to the DOM */
function create(input?: TimePickerData) {
    var _input = parseTimePickerData(input);
    
    var context = new DiContext(_input.config, _input.element);
    return publicTimePicker(context);
}

export {
    TimePickerData,
    create
}