import { Clock } from "./clock";
import { DiContext } from "./di";

function publicClock(context: DiContext) {
    var clock = context.buildClock();
    var element = context.getRootElement();
    return {
        element,
        getTime: () => clock.getTime(),
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
        }
    };
}

export {
    publicClock
}