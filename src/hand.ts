import { getAngleDelta } from './angle';
import { Position } from './numbers';

declare var XXX: number[];
if (!(<any>window).XXX)(<any>window).XXX = [];

type BallElements =
    {
        ballPostion: HTMLElement[],
        hands: HTMLElement[]
    }

const _90 = Math.PI / 2;

class Hand {
    private angle = _90;
    constructor(public elements: BallElements) {
        this.setPositon(this.angle, Position.far);
    }

    setPositon(angle: number, position: Position) {
        
        var delta = getAngleDelta(this.angle, angle);
        this.angle = this.angle + delta;

        this.elements.hands.forEach(h => h.style.transform = `rotate(${this.angle}rad)`);
        XXX.push(1);
        position === Position.near ?
            this.elements.ballPostion.forEach(b => b.classList.add("mtl-b-pos-pm")) :
            this.elements.ballPostion.forEach(b => b.classList.remove("mtl-b-pos-pm"));
    }
}

export {
    Hand
}