import { getAngleDelta } from './angle';
import { Position } from './numbers';

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
        
        position === Position.near ?
            this.elements.ballPostion.forEach(b => b.classList.add("smt-b-pos-pm")) :
            this.elements.ballPostion.forEach(b => b.classList.remove("smt-b-pos-pm"));
    }
}

export {
    Hand
}