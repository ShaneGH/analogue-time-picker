import { Clock } from "./clock";
import { DiContext } from "./di";

type PublicClock =
    {
        element: HTMLElement
        getTime: () => {hour: number, minute: number},
        setTime: (hours: number, minutes: number) => void,
        set12h: () => void,
        set24h: () => void,
        showHours: () => void,
        showMinutes: () => void,
        ok: () => void,
        cancel: () => void,
        onTimeChanged: (callback: object) => void,
        onOk: (callback: object) => void,
        onCancel: (callback: object) => void,
        onDispose: (callback: object) => void,
        dispose: () => void
    }

function publicClock(context: DiContext): PublicClock {
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
        setTime: (hours: number, minutes: number) => clock.setTime(hours, minutes),
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
    PublicClock
}