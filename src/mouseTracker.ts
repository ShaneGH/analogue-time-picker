import { registerMouseEvent } from "./utils";

class MouseTracker {

    _mouseUp: () => void
    _mouseMove: () => void
    constructor() {
        this._mouseUp = registerMouseEvent(document, "mouseup", e => this.mouseUp());
        this._mouseMove = registerMouseEvent(document, "mousemove", e => this.mouseMove(e));
    }

    _onMouseUp: (() => void)[] = [];
    onMouseUp(callback: () => void) {
        this._onMouseUp.push(callback);
    }

    _onMouseMove: ((e: MouseEvent) => void)[] = [];
    onMouseMove(callback: (e: MouseEvent) => void) {
        this._onMouseMove.push(callback);
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

    dispose() {
        this._mouseUp();
        this._mouseMove();
        this._onMouseUp.length = 0;
        this._onMouseMove.length = 0;
    }
}

export {
    MouseTracker
}