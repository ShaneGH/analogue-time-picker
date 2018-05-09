

function buildHoursList(
    root: HTMLElement,
    index: number): HTMLElement[] {
    var list: HTMLElement[] = [];

    for (var i = 0; i < 12; i++) {
        list[i] = <HTMLElement>root.querySelectorAll(`.smt-hours .smt-n-${i}`)[index];
    }

    return list;
}

function buildMinutesList(root: HTMLElement): HTMLElement[] {
    var list: HTMLElement[] = [];

    for (var i = 0; i < 12; i++) {
        list[(i * 5) % 60] = <HTMLElement>root.querySelectorAll(`.smt-minutes .smt-n-${i}`)[0];
    }

    return list;
}

type Elements = 
    {
        clock: HTMLElement,
        hourContainer: HTMLElement,
        minuteContainer: HTMLElement,
        hands: HTMLElement[],
        ballPostion: HTMLElement[],
        hours: HTMLElement[],
        minutes: HTMLElement[]
    }

function buildElements(root: HTMLElement): Elements {
    var el = {
        clock: root,
        hourContainer: <HTMLElement>root.querySelectorAll(".smt-hours")[0],
        minuteContainer: <HTMLElement>root.querySelectorAll(".smt-minutes")[0],
        hands: Array.prototype.slice.call(root.querySelectorAll(".smt-h-cnt")),
        ballPostion: Array.prototype.slice.call(root.querySelectorAll(".smt-b-pos")),
        hours: buildHoursList(root, 0).concat(buildHoursList(root, 1)),
        minutes: buildMinutesList(root),
        selectedNumber: null
    };

    var missingH = !!el.hours
        .filter(x => !x)
        .length
        && el.hours.length !== 24;

    var missingM = !!el.minutes
        .filter(x => !x)
        .length
        && el.minutes.length !== 12;

    if (!el.clock ||
        !el.hourContainer ||
        !el.minuteContainer ||
        !el.hands ||
        !el.ballPostion ||
        missingH ||
        missingM) {

        throw new Error("Invalid html element");
    }
    
    // re-arrange numbers to put the 12 and 24 in differnt places
    el.hours.splice(11, 0, el.hours.splice(0, 1)[0]);
    el.hours.splice(0, 0, el.hours.splice(12, 1)[0]);

    return el;
}

export {
    buildElements,
    Elements
}