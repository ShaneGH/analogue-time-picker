
/** Increase a numer with loop back over the max value */
function increase(val: string, max: number) {
    var v = parseInt(val) + 1;
    return  v > max ? 0 : v;
}

/** Decrease a numer with loop back over the min value */
function decrease(val: string, max: number) {
    var v = parseInt(val) - 1;
    return v < 0 ? max : v;
}

/** Get the value and mouse position after a number key is pressed */
function getNewElementValues(element: HTMLInputElement, key: string, max: number) {
    var actualStart = element.selectionStart || 0;
    var start = actualStart > 1 ? 
        1 : 
        actualStart ;

    var val1 = (element.value || "").substr(0, start);
    var val2 = (element.value || "").substr(start + 1);

    var value = parseInt(`${val1}${key}${val2}`);
    if (isNaN(value) || value < 0) return null;

    if (value <= max) {
        var skip = 0;
        if (!val1 && !val2 && value * 10 > max) {
            // special case for when only 1 digit fits in the text box
            skip++;
        }

        return {
            value,
            nextPosition: actualStart + 1 + skip
        };
    }

    if (!actualStart) {
        // set last digit to 0 and try again
        value -= value % 10;
        if (value <= max)
            return {
                value,
                nextPosition: actualStart + 1
            };
            
        // just use the key as is
        value = parseInt(key);
        if (!isNaN(value) && value <= max) 
            return {
                value,
                // skipped an extra digit by using first key
                nextPosition: actualStart + 2
            };
    }
    
    return null;
}

type KeyPressDetailsValues =
    {
        handled?: boolean
        value?: number
        nextPosition?: number
    }

var numberKey = /^\d$/;
var fKey = /^F\d+$/;

/** Get values which can inform a decision on what to do when a key is pressed */
function keyPressDetails(element: HTMLInputElement, e: KeyboardEvent, max: number): KeyPressDetailsValues {

    var handled = true;
    switch (e.key) {
        case "ArrowUp":
            return {
                handled: true,
                value: increase(element.value, max)
            };
        case "ArrowDown":
            return {
                handled: true,
                value: decrease(element.value, max)
            };
        case "ArrowRight":
            var nextPosition = (element.selectionStart || 0) + 1;
            return {
                handled: nextPosition > 2,
                nextPosition: nextPosition > 2 ? nextPosition : undefined
            };
        case "ArrowLeft":
            var nextPosition = (element.selectionStart || 0) - 1;
            return {
                handled: nextPosition < 0,
                nextPosition: nextPosition < 0 ? nextPosition : undefined
            };
        case "Tab":
            return {
                handled: false
            };
        default:
            if (numberKey.test(e.key)) {
                return {
                    handled: true,
                    ...getNewElementValues(element, e.key, max)
                };
            } else if (fKey.test(e.key)) {
                return {
                    handled: false
                };
            }
    }
    
    return { handled: true };
}

export {
    keyPressDetails
}