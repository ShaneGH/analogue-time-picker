import { Clock } from "./clock";

function publicClock(clock: Clock, root: HTMLElement) {
    return {
        element: root,
        time: {
            hours: clock.hours.value.value,
            minutes: clock.minutes.value.value
        },
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
                throw new Error("onDispose callback must be a function");
            }

            clock.onDispose(callback);
        }
    };
}

export {
    publicClock
}