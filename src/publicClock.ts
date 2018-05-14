import { Clock } from "./clock";
import { DiContext } from "./di";

function publicClock(context: DiContext) {
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
        }
    };
}

export {
    publicClock
}