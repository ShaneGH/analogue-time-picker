import { registerEvent } from "./utils";

class MouseTracker {

    _dispose: (() => void)[] = [];
    constructor() {
        this._dispose.push(
            registerEvent(document, "mouseup", e => this.mouseUp()),
            registerEvent(document, "mousemove", e => this.mouseMove(e)));
    }

    mouseMove(e: MouseEvent){
        this._onMouseMove
            .slice(0)
            .forEach(f => f(e));
    }

    mouseUp(){
        this._onMouseUp
            .slice(0)
            .forEach(f => f());
    }

    _onMouseUp: (() => void)[] = [];
    onMouseUp(callback: () => void) {
        this._onMouseUp.push(callback);
    }

    _onMouseMove: ((e: MouseEvent) => void)[] = [];
    onMouseMove(callback: (e: MouseEvent) => void) {
        this._onMouseMove.push(callback);
    }

    dispose() {
        this._dispose.forEach(x => x());
        this._dispose.length = 0;
        this._onMouseUp.length = 0;
        this._onMouseMove.length = 0;
    }
}

export {
    MouseTracker
}