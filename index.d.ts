/** The time picker returned to the calling project.  */
export type TimePicker =
    {
        /** The element which contains the clock */
        element: HTMLElement

        /** Set the width of the time picker. The height is proportional to the width.  */
        setWidth: (width: number | string) => void

        /** Return the current time */
        getTime: () => {hour: number, minute: number}
        
        /** Set the current time programmatically */
        setTime: (hours?: number | string, minutes?: number | string) => void
        
        /** Set the clock to 12 hour mode. 
         * If the clock is in 12h mode, the times used in getTime, setTime and onOk will still be in 24h format */
        set12h: () => void
        
        /** Set the clock to 24 hour mode */
        set24h: () => void
        
        /** Show the hour hand */
        showHours: () => void
        
        /** Show the minute hand */
        showMinutes: () => void
        
        /** Dispose of the time picker and invoke any "onOk" event handlers */
        ok: () => void
        
        /** Dispose of the time picker and invoke any "onCancel" event handlers */
        cancel: () => void
        
        /** Add an event handler for when the time changes */
        onTimeChanged: (callback: (hour: number, minute: number) => void) => void
        
        /** Add an event handler for when the set time operation completes successfully */
        onOk: (callback: (hour: number, minute: number) => void) => void
        
        /** Add an event handler for when the set time operation is canceled */
        onCancel: (callback: () => void) => void
        
        /** Add an event handler for when the time picker is disposed of */
        onDispose: (callback: () => void) => void
        
        /** Manually dispose of the time picker */
        dispose: () => void
    }
    
/** The results of a timepicker input */
export type TimePickerInput =
{
    /** If the time picker is open, get it's time. Otherwise, get the time in the <input>. 
     * If the input cannot be parsed, returns null */
    getTime: () => {hour: number, minute: number} | null,

    /** Set the time in the time picker if open, otherwise, set the time in the input.
     * If force=true, set the time in the input either way
     */
    setTime: (hour: number | string, minute: number | string, force?: boolean) => void,

    /**Dispose of the time picker input */
    dispose:  () => void,
}

/** Data to initialize a time picker with a time */
export type InitializeTimeData =
    {
        /** The initial time to show. If a Date is used, it's "getHours()" and "getMinutes()" functions will be called to get the time */
        time?: {
            /** The hour in 24hour format. 24 is not a valid hour, use 0 instead */
            hour?: number | string,
            /** The minute */
            minute?: number | string
        } | Date
    }

/** Common inputs for all time picker export types */
export type CommonData =
    {    
        /** Specify a 12 or 24 hour clock. If not specified, the user browser default will be used.
         * If the clock is in 12h mode, the times used as inputs, in getTime, setTime and onOk will still be in 24h format  */
        mode?: 12 | 24 | "12" | "24",
    
        /** The width of the component. Default 300px. If set, will also ajust the font-size.
         * If a % value is used, the control will grow to fit parent element size. In this case, font-size must also be set on the parent.
         * If an em value is used, the font-size will be un altered. This may have some unexpected outcomes. */
        width?: number | string
    }

/** The inputs for a new time picker */
export type TimePickerData = 
    CommonData & 
    InitializeTimeData &
    {
        /** The element to create the time picker inside. If not specified, a new div will be created */
        element?: HTMLElement
    }

/** The inputs for a new modal time picker */
export type TimePickerModalData = CommonData & InitializeTimeData

/** The inputs for a new time picker, which launches when an input receives focus */
export type TimePickerInputData = 
    CommonData & 
    InitializeTimeData &
    {
        /** The input element */
        inputElement?: HTMLInputElement
    }

/** Create a new time picker. The timepicker lives in the "element" return value which can then be appended to the DOM */
export function timePicker(input?: TimePickerData): TimePicker

/** Create a new time picker and render in a modal */
export function timePickerModal(input?: TimePickerModalData): TimePicker

/** Create a new time picker and render in a modal each time an input is focused */
export function timePickerInput(input?: TimePickerInputData): TimePickerInput