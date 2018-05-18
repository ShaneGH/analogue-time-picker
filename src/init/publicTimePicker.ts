import { DiContext } from '../di';

/** The time picker returned to the calling project. All inputs are optional "objects" so as to force sanatization */
type TimePicker =
    {
        /** The element which contains the clock */
        element: HTMLElement

        /** Set the width of the time picker. The height is proportional to the width.  */
        setWidth: (width: object) => void

        /** Return the current time */
        getTime: () => {hour: number, minute: number}
        
        /** Set the current time programmatically */
        setTime: (hours?: object, minutes?: object) => void
        
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
        onTimeChanged: (callback: object) => void
        
        /** Add an event handler for when the set time operation completes successfully */
        onOk: (callback: object) => void
        
        /** Add an event handler for when the set time operation is canceled */
        onCancel: (callback: object) => void
        
        /** Add an event handler for when the time picker is disposed of */
        onDispose: (callback: object) => void
        
        /** Manually dispose of the time picker */
        dispose: () => void
    }

/**Wrap a DI context in a new public TimePicker object.
 * The pulic TimePicker is more fault tolerant and is made 
 * to interact with js rather than ts
 * It also has dispose logic and an onDispose event */
function publicTimePicker(context: DiContext): TimePicker {
    var timePicker = context.buildTimePicker();
    var element = context.getRootElement();
    
    var onDispose: (() => void)[] = [];
    function dispose() {
        context.dispose();
        onDispose
            .splice(0, Number.MAX_VALUE)
            .forEach(f => f());
    }

    timePicker.onOk(dispose);    
    timePicker.onCancel(dispose);

    return {
        element,
        setWidth: (width: object) => {
            context.htmlTree.setWidth(
                width == null || <any>width === "" ?
                    "100%" :
                    typeof width === "number" ? `${width}px` : width.toString());
        },
        getTime: () => timePicker.getTime(),
        setTime: (hours?: object, minutes?: object) => {
            var h = parseInt(hours as any);
            if (isNaN(h)) throw new Error(`The hours value "${hours}" must be a number`);
            
            var m = parseInt(minutes as any);
            if (isNaN(m)) throw new Error(`The minutes value "${minutes}" must be a number`);

            if (h < 0 || h > 23) throw new Error(`The hours value "${h}" must be between 0 and 23`);
            if (m < 0 || m > 59) throw new Error(`The minutes value "${m}" must be between 0 and 59`);

            timePicker.setTime(h, m)
        },
        set12h: () => timePicker.setMode(12),
        set24h: () => timePicker.setMode(24),
        showHours: () => timePicker.showHours(),
        showMinutes: () => timePicker.showMinutes(),
        ok: () => timePicker.okClick(),
        cancel: () => timePicker.cancelClick(),
        onTimeChanged: (callback: object) => {
            if (typeof callback !== "function") {
                throw new Error("onOk callback must be a function");
            }

            timePicker.onTimeChanged(callback);
        },
        onOk: (callback: object) => {
            if (typeof callback !== "function") {
                throw new Error("onOk callback must be a function");
            }

            timePicker.onOk(callback);
        },
        onCancel: (callback: object) => {
            if (typeof callback !== "function") {
                throw new Error("onCancel callback must be a function");
            }

            timePicker.onCancel(callback);
        },
        onDispose: (callback: object) => {
            if (typeof callback !== "function") {
                throw new Error("onCancel callback must be a function");
            }

            onDispose.push(callback);
        },
        dispose
    };
}

export {
    publicTimePicker,
    TimePicker
}