
/** Data to initialize a time picker with a time */
type InitializeTimeData =
    {
        /** The initial time to show. If a Date is used, it's "getHours()" and "getMinutes()" functions will be called to get the time */
        time?: {
            /** The hour in 24hour format. 24 is not a valid hour, use 0 instead */
            hour?: object, 
            /** The minute */
            minute?: object
        } | Date
    }

/** Common inputs for all time picker types */
type CommonData =
    {    
        /** Specify a 12 or 24 hour clock. If not specified, the user browser default will be used.
         * If the clock is in 12h mode, the times used as inputs, in getTime, setTime and onOk will still be in 24h format  */
        mode?: object,
    
        /** The width of the component. Default 300px. If set, will also ajust the font-size.
         * If a % value is used, the control will grow to fit parent element size. In this case, font-size must also be set on the parent.
         * If an em value is used, the font-size will be un altered. This may have some unexpected outcomes. */
        width?: object
    }

function parseTimeValues (hour?: object, minute?: object) {
    var h = 0;
    if (hour != null) {
        h = parseInt(hour as any);
        if (isNaN(h) || h < 0 || h > 23) {
            throw new Error(`The hr (${hour}) argument must be between 0 and 23.`);
        }
    }
    
    var m = 0;
    if (minute != null) {
        m = parseInt(minute as any);
        if (isNaN(m) || m < 0 || m > 59) {
            throw new Error(`The mn (${minute}) argument must be between 0 and 59.`);
        }
    }

    return {
        hour: h,
        minute: m
    };
}

function parseTimeInput (time?: {hour?: object, minute?: object} | Date) {
    if (!time) return {hour: 0, minute: 0};

    if (time instanceof Date) {
        return {
            hour: time.getHours(),
            minute: time.getMinutes()
        };
    } else {
        return parseTimeValues(time.hour, time.minute);
    }
}

function parseHtmlElement(el?: object) {
    if (el == null) return undefined;
    if (el instanceof HTMLElement) return el;
    
    throw new Error("The element must be a HTMLElement");
}

function parseMode(mode?: object) {
    if (mode == null) return 24;
    
    var m = parseInt(mode as any);
    if (m === 12) return 12;
    else if (m === 24) return 24;
    else throw new Error("The mode argument must be null, undefined, 12 or 24.");
}

function parseWidth(width?: object) {
    if (width == null) return "300px";
    
    if (typeof width === "number") {
        if (width < 0) throw new Error(`The width (${width}) argument must be >= 0.`);
        return `${width}px`;
    } else if (typeof width === "string") {
        return width;
    } else {
        throw new Error(`The width (${width}) argument must be a number or string.`);
    }
}

export {
    parseTimeInput,
    parseTimeValues,
    parseHtmlElement,
    parseMode,
    parseWidth,

    InitializeTimeData,
    CommonData
}