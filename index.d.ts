
/** The inputs for a new clock. */
export type Input =
{
    /** The element to create the clock inside. If not specified, a new div will be created */
    element?: HTMLElement, 

    /** The initial time to show. If a Date is used, it's "getHours()" and "getMinutes()" functions will be called to get the time */
    time?: {
        /** The hour in 24hour format. 24 is not a valid hour, use 0 instead */
        hour?: number, 
        /** The minute */
        minute?: number
    } | Date,

    /** Specify a 12 or 24 hour clock. If not specified, the user browser default will be used.
     * If the clock is in 12h mode, the times used as inputs, in getTime, setTime and onOk will still be in 24h format  */
    mode?: 12 | 24
}

/** The clock returned to the calling project. */
export type Clock =
    {
        /** The element which contains the clock */
        element: HTMLElement

        /** Return the current time */
        getTime: () => {hour: number, minute: number},
        
        /** Set the current time programmatically */
        setTime: (hours: number, minutes: number) => void,
        
        /** Set the clock to 12 hour mode. 
         * If the clock is in 12h mode, the times used in getTime, setTime and onOk will still be in 24h format */
        set12h: () => void,
        
        /** Set the clock to 24 hour mode */
        set24h: () => void,
        
        /** Show the hour hand */
        showHours: () => void,
        
        /** Show the minute hand */
        showMinutes: () => void,
        
        /** Dispose of the clock and invoke any "onOk" event handlers */
        ok: () => void,
        
        /** Dispose of the clock and invoke any "onCancel" event handlers */
        cancel: () => void,
        
        /** Add an event handler for when the time changes */
        onTimeChanged: (callback: (hour: number, minute: number) => void) => void,
        
        /** Add an event handler for when the set time operation completes successfully */
        onOk: (callback: (hour: number, minute: number) => void) => void,
        
        /** Add an event handler for when the set time operation is canceled */
        onCancel: (callback: () => void) => void,
        
        /** Add an event handler for when the clock is disposed of */
        onDispose: (callback: () => void) => void,
        
        /** Manually dispose of the clock */
        dispose: () => void
    }

/** Create a new time picker. The timepicker lives in the "element" return value which can then be appended to the DOM */
export function timePicker(input?: Input) : Clock