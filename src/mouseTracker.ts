import { registerMouseEvent } from "./utils";

declare var XXX: number[];
if (!(<any>window).XXX)(<any>window).XXX = [];

class MouseTracker {

    _mouseUp: () => void
    _mouseMove: () => void
    constructor() {
        this._mouseUp = registerMouseEvent(document, "mouseup", e => this.mouseUp());
        this._mouseMove = registerMouseEvent(document, "mousemove", e => this.mouseMove(e));
    }

    _onMouseUp: (() => void)[] = [];
    onMouseUp(callback: () => void) {
        XXX.push(50);
        this._onMouseUp.push(callback);
    }

    _onMouseMove: ((e: MouseEvent) => void)[] = [];
    onMouseMove(callback: (e: MouseEvent) => void) {
        XXX.push(51);
        this._onMouseMove.push(callback);
    }

    mouseMove(e: MouseEvent){
        XXX.push(52);
        this._onMouseMove
            .slice(0)
            .forEach(f => f(e));
    }

    mouseUp(){
        XXX.push(53);
        this._onMouseUp
            .slice(0)
            .forEach(f => f());
    }

    dispose() {
        XXX.push(54);
        this._mouseUp();
        this._mouseMove();
        this._onMouseUp.length = 0;
        this._onMouseMove.length = 0;
    }
}

export {
    MouseTracker
}