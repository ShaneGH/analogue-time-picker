

type EventElement =
    {
        addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void
        removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void
    }

function registerEvent(element: EventElement, event: string, fun: (e: UIEvent) => void) {
    element.addEventListener(event, fun);

    var removed = false;
    return function () {
        if (removed) return;
        removed = true;
        element.removeEventListener(event, fun);
    };
}

function registerMouseEvent(element: EventElement, event: string, fun: (e: MouseEvent) => void) {
    return registerEvent(element, event, fun);
}

function registerKeyEvent(element: EventElement, event: string, fun: (e: KeyboardEvent) => void) {
    return registerEvent(element, event, fun);
}

export {
    registerKeyEvent,
    registerMouseEvent
}