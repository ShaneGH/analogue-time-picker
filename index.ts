import * as _timePicker from "./src/init/timePicker"
import * as _timePickerModal from "./src/init/timePickerModal"
import * as _timePickerInput from "./src/init/timePickerInput"
import {enable as enableCss} from "./src/assets/style"

const timePicker = _timePicker.create
const timePickerModal = _timePickerModal.create
const timePickerInput = _timePickerInput.create

// add css to page
enableCss();

export {
    timePicker,
    timePickerModal,
    timePickerInput
}