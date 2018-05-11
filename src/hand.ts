
import { Position } from "./numbers";

type BallElements =
    {
        ballPostion: HTMLElement[],
        hands: HTMLElement[],
        hours: HTMLElement[],
        minutes: HTMLElement[]
    }

class Hand {
    constructor(public elements: BallElements, angle: number, position: Position) {
        this.setPositon(angle, position);
    }

    setPositon(angle: number, position: Position) {
        this.elements.hands.forEach(h => h.style.transform = `rotate(${angle}rad)`);
        
        position === Position.near ?
            this.elements.ballPostion.forEach(b => b.classList.add("smt-b-pos-pm")) :
            this.elements.ballPostion.forEach(b => b.classList.remove("smt-b-pos-pm"));
    }
}

export {
    Hand
}