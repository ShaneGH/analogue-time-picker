import { DiContext } from './di';

/** The clock returned to the calling project. All inputs are "objects" so as to force sanatization */
type Clock =
    {
        /** The element which contains the clock */
        element: HTMLElement

        /** Return the current time */
        getTime: () => {hour: number, minute: number},
        
        /** Set the current time programmatically */
        setTime: (hours?: object, minutes?: object) => void,
        
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
        onTimeChanged: (callback: object) => void,
        
        /** Add an event handler for when the set time operation completes successfully */
        onOk: (callback: object) => void,
        
        /** Add an event handler for when the set time operation is canceled */
        onCancel: (callback: object) => void,
        
        /** Add an event handler for when the clock is disposed of */
        onDispose: (callback: object) => void,
        
        /** Manually dispose of the clock */
        dispose: () => void
    }

const nan = parseInt("x");
function parse(value?: object) {
    if (typeof value === "number") return value;
    if (typeof value === "string") return parseInt(value);
    
    return nan;
}

function publicClock(context: DiContext): Clock {
    var clock = context.buildClock();
    var element = context.getRootElement();
    
    var onDispose: (() => void)[] = [];
    function dispose() {
        context.dispose();
        onDispose
            .splice(0, Number.MAX_VALUE)
            .forEach(f => f());
    }

    clock.onOk(dispose);    
    clock.onCancel(dispose);

    return {
        element,
        getTime: () => clock.getTime(),
        setTime: (hours?: object, minutes?: object) => {
            var h = parse(hours);
            if (isNaN(h)) throw new Error(`The hours value "${hours}" must be a number`);
            
            var m = parse(minutes);
            if (isNaN(m)) throw new Error(`The minutes value "${minutes}" must be a number`);

            clock.setTime(h, m)
        },
        set12h: () => clock.setMode(12),
        set24h: () => clock.setMode(24),
        showHours: () => clock.showHours(),
        showMinutes: () => clock.showMinutes(),
        ok: () => clock.okClick(),
        cancel: () => clock.cancelClick(),
        onTimeChanged: (callback: object) => {
            if (typeof callback !== "function") {
                throw new Error("onOk callback must be a function");
            }

            clock.onTimeChanged(callback);
        },
        onOk: (callback: object) => {
            if (typeof callback !== "function") {
                throw new Error("onOk callback must be a function");
            }

            clock.onOk(callback);
        },
        onCancel: (callback: object) => {
            if (typeof callback !== "function") {
                throw new Error("onCancel callback must be a function");
            }

            clock.onCancel(callback);
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
    publicClock,
    Clock
}