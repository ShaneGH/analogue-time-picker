

function buildHoursList(
    root: HTMLElement,
    index: number): HTMLElement[] {
    var list: HTMLElement[] = [];

    for (var i = 1; i <= 12; i++) {
        list[i] = <HTMLElement>root.querySelectorAll(`.smt-hours .smt-n-${i}`)[index];
    }

    return list;
}

function buildMinutesList(root: HTMLElement): HTMLElement[] {
    var list: HTMLElement[] = [];

    for (var i = 1; i <= 12; i++) {
        list[(i * 5) % 60] = <HTMLElement>root.querySelectorAll(`.smt-minutes .smt-n-${i}`)[0];
    }

    return list;
}

type Elements = 
    {
        clock: HTMLElement,
        hourContainer: HTMLElement,
        minuteContainer: HTMLElement,
        face: HTMLElement,
        hands: HTMLElement[],
        ballPostion: HTMLElement[],
        selectedNumber: HTMLElement | null,
        hours: HTMLElement[],
        minutes: HTMLElement[]
    }

function buildElements(root: HTMLElement): Elements {
    var el = {
        clock: root,
        hourContainer: <HTMLElement>root.querySelectorAll(".smt-hours")[0],
        minuteContainer: <HTMLElement>root.querySelectorAll(".smt-minutes")[0],
        face: <HTMLElement>root.querySelectorAll(".smt-face")[0],
        hands: Array.prototype.slice.call(root.querySelectorAll(".smt-h-cnt")),
        ballPostion: Array.prototype.slice.call(root.querySelectorAll(".smt-b-pos")),
        hours: buildHoursList(root, 0).concat(buildHoursList(root, 1).slice(1)),
        minutes: buildMinutesList(root),
        selectedNumber: null
    };

    var missingH = !!el.hours
        .slice(1)
        .filter(x => !x)
        .length
        && el.hours.length !== 25;

    var missingM = !!el.minutes
        .filter(x => !x)
        .length
        && el.minutes.length !== 12;

    if (!el.clock ||
        !el.hourContainer ||
        !el.minuteContainer ||
        !el.hands ||
        !el.face ||
        !el.ballPostion ||
        missingH ||
        missingM) {

        throw new Error("Invalid html element");
    }

    return el;
}

export {
    buildElements,
    Elements
}