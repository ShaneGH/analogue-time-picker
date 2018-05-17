

type EventElement =
    {
        addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void
        removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void
    }

/** Add an event listener to an element and return a function which will dispose of the listener */
function registerEvent(element: EventElement, event: string, fun: (e: UIEvent) => void) {

    function f() { return fun.apply(this, arguments); }
    element.addEventListener(event, f);

    var removed = false;
    return function () {
        if (removed) return;
        removed = true;
        element.removeEventListener(event, f);
    };
}

/** Add an event listener to an element and return a function which will dispose of the listener */
function registerMouseEvent(element: EventElement, event: string, fun: (e: MouseEvent) => void) {
    return registerEvent(element, event, fun);
}

/** Add an event listener to an element and return a function which will dispose of the listener */
function registerKeyEvent(element: EventElement, event: string, fun: (e: KeyboardEvent) => void) {
    return registerEvent(element, event, fun);
}

/** Add an event listener to an element and return a function which will dispose of the listener */
function registerTouchEvent(element: EventElement, event: string, fun: (e: TouchEvent) => void) {
    return registerEvent(element, event, fun);
}

export {
    registerEvent,
    registerKeyEvent,
    registerMouseEvent,
    registerTouchEvent
}