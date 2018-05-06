

type EventElement =
    {
        addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void
        removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void
    }

function registerEvent(element: EventElement, event: string, fun: (e: MouseEvent) => void) {
    element.addEventListener(event, fun);

    var removed = false;
    return function () {
        if (removed) return;
        removed = true;
        element.removeEventListener(event, fun);
    };
}

export {
    registerEvent
}