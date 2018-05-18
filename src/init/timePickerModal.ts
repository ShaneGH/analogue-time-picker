import { DiContext } from '../di';
import { createModal } from '../utils/html';
import { CommonData, InitializeTimeData, parseMode, parseTimeInput, parseWidth } from './parseInputs';
import { publicTimePicker } from './publicTimePicker';

/** The inputs for a new modal time picker */
type TimePickerModalData = CommonData & InitializeTimeData

function parseInputs(input?: TimePickerModalData) {

    if (!input) input = {};
    return {
        config: {
            time: parseTimeInput(input.time),
            mode: parseMode(input.mode) as (12 | 24),
            width: parseWidth(input.width)
        }
    };
}

/** Create a new time picker and render in a modal */
function create(input?: TimePickerModalData) {
    var _input = parseInputs(input);
    
    var context = new DiContext(_input.config);
    var timePicker = publicTimePicker(context);
    var modal = createModal(timePicker.element);

    modal.onClickOrEsc(() => timePicker.cancel());
    timePicker.onDispose(modal.dispose);
    
    // focus on the first textbox in the time picker
    context.getInnerElement<HTMLInputElement>(".atp-hour").focus();

    return timePicker;
}

export {
    TimePickerModalData,
    create
}