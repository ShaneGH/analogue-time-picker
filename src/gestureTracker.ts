import { registerEvent } from './utils';

/** Track the mouse position over the entire screen and report back */
class GestureTracker<T extends UIEvent> {

    _disposables: (() => void)[] = [];
    constructor(moveEvents: string[], finishEvents: string[]) {
        var me = moveEvents
            .map(x => registerEvent(document, x, e => this.move(e as T)));
        var fe = finishEvents
            .map(x => registerEvent(document, x, e => this.finish()));

        this._disposables = me.concat(fe);
    }

    _onFinished: (() => void)[] = [];
    onFinished(callback: () => void) {
        this._onFinished.push(callback);
    }

    _onMove: ((e: T) => void)[] = [];
    onMove(callback: (e: T) => void) {
        this._onMove.push(callback);
    }

    move(e: T){
        this._onMove
            .slice(0)
            .forEach(f => f(e));
    }

    finish(){
        this._onFinished
            .slice(0)
            .forEach(f => f());
    }

    dispose() {
        this._onFinished.length = 0;
        this._onMove.length = 0;
        this._disposables
            .splice(0, Number.MAX_VALUE)
            .forEach(f => f());
    }
}

export {
    GestureTracker
}