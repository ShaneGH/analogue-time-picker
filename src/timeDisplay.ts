// import {  registerKeyEvent } from "./utils";

// function increase(val: string, max: number) {
//     var v = parseInt(val) + 1;
//     return  v > max ? 0 : v;
// }

// function decrease(val: string, max: number) {
//     var v = parseInt(val) - 1;
//     return v < 0 ? max : v;
// }

// function getElementNewValues(element: HTMLInputElement, key: string, max: number) {
//     var actualStart = element.selectionStart || 0;
//     var start = actualStart > 1 ? 
//         1 : 
//         actualStart ;

//     var val1 = (element.value || "").substr(0, start);
//     var val2 = (element.value || "").substr(start + 1);

//     var value = parseInt(`${val1}${key}${val2}`);
//     if (value < 0 || value > max) return null;

//     return {
//         value,
//         position: actualStart + 1,
//         characterReplaced: actualStart ? 2 : 1
//     };
// }

// function keyPressDetails(element: HTMLInputElement, e: KeyboardEvent, max: number) {

//     var handled = true;
//     switch (e.key) {
//         case "ArrowUp":
//             return {
//                 handled: true,
//                 value: increase(element.value, max),
//                 position: null,
//                 characterReplaced: null
//             };
//         case "ArrowDown":
//             return {
//                 handled: true,
//                 value: decrease(element.value, max),
//                 position: null,
//                 characterReplaced: null
//             };
//         case "ArrowRight":
//         case "ArrowLeft":
//         case "Tab":
//             return {
//                 handled: false
//             };
//         default:
//             if (numberKey.test(e.key)) {
//                 return {
//                     handled: true,
//                     ...getElementNewValues(element, e.key, max)
//                 };
//             } else if (fKey.test(e.key)) {
//                 return {
//                     handled: false
//                 };
//             }
//     }
    
//     return { handled: true };
// }

// // var numberKey = /^\d$/;
// // var fKey = /^F\d+$/;
// class TimeDisplay {
//     // _minutes: (() => void) | null = null;
//     // _hours: (() => void) | null = null;

//     // constructor(public hoursElement: HTMLInputElement, public minutesElement: HTMLInputElement, public okElement: HTMLElement) {
//     //     this._hours = registerKeyEvent(hoursElement, "keydown", e => this.onHourKeyPress(e));
//     //     this._minutes = registerKeyEvent(minutesElement, "keydown", e => this.onMinuteKeyPress(e));
//     // }

//     // _timeChangedCallbacks: ((hours: number, minutes: number) => void)[] = [];
//     // onTimeChanged(callback: ((hours: number, minutes: number) => void)) {
//     //     this._timeChangedCallbacks.push(callback);
//     // }

//     // setTime(hours: number | null | undefined, minutes: number | null | undefined) {

//     //     var changed = false;
//     //     if (hours != null && 
//     //         parseInt(this.hoursElement.value) !== hours &&
//     //         hours >= 0 &&
//     //         hours < 60) {

//     //         changed = true;
//     //         this.hoursElement.value = `0${hours.toFixed()}`.slice(-2);
//     //     }

//     //     if (minutes != null && 
//     //         parseInt(this.minutesElement.value) !== minutes &&
//     //         minutes >= 0 &&
//     //         minutes < 60) {
                
//     //         changed = true;
//     //         this.minutesElement.value = `0${minutes.toFixed()}`.slice(-2);
//     //     }

//     //     if (changed) {
//     //         var h = hours == null ? parseInt(this.hoursElement.value || "0") : hours;
//     //         var m = minutes == null ? parseInt(this.minutesElement.value || "0") : minutes;

//     //         this._timeChangedCallbacks
//     //             .slice(0)
//     //             .forEach(x => x(h, m));
//     //     }
//     // }

//     // validateTime(hours: number, minutes: number) {
//     //     if (hours > 23 || hours < 0) throw new Error(`Invalid hours: ${hours}`);
//     //     if (minutes > 59 || minutes < 0) throw new Error(`Invalid minutes: ${minutes}`);
//     // }
    
//     // onHourKeyPress(e: KeyboardEvent) {
//     //     var focusOnMinutes = (x: number) => {
//     //         x > 1 ? this.focusOnMinutes() : null
//     //     }

//     //     var details = keyPressDetails(this.hoursElement, e, 23);
//     //     if (details.handled) e.preventDefault();
//     //     if (details.value != null) {
//     //         this.setTime(details.value, 999);
//     //     }

//     //     if (details.position) {
//     //         this.hoursElement.selectionEnd = details.position;
//     //         this.hoursElement.selectionStart = details.position;
//     //         if (details.position > 1) {
//     //             this.focusOnMinutes();
//     //         }
//     //     }
//     // }

//     // onMinuteKeyPress(e: KeyboardEvent) {
//     //     var focusOnMinutes = (x: number) => {
//     //         x > 1 ? this.focusOnMinutes() : null
//     //     }

//     //     var details = keyPressDetails(this.minutesElement, e, 59);
//     //     if (details.handled) e.preventDefault();
//     //     if (details.value != null) {
//     //         this.setTime(999, details.value);
//     //     }

//     //     if (details.position) {
//     //         this.minutesElement.selectionEnd = details.position;
//     //         this.minutesElement.selectionStart = details.position;
//     //         if (details.position > 1) {
//     //             this.okElement.focus();
//     //         }
//     //     }
//     // }

//     dispose(){
//         if (this._minutes) {
//             this._minutes();
//             this._minutes = null;
//         }
        
//         if (this._hours) {
//             this._hours();
//             this._hours = null;
//         }
//     }
// }

// export {
//     TimeDisplay
// }