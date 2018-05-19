import { DiContext } from '../../src/di';
import { TimePicker, publicTimePicker } from '../../src/init/publicTimePicker';

var isIe = (function() {
    try {
        return new Event("keydown"), false;
    } catch (e) {
        return true;
    }
}())

function createEvent(name: string) {
    if (isIe) {
        var ev = document.createEvent("Event");
        ev.initEvent(name, true, true);
        return ev;
    }

    return new Event(name);
}

describe("inputBoxKeyEvent_tests.ts", () => {

    var clock: TimePicker, ctxt: DiContext, hours: HTMLInputElement, minutes: HTMLInputElement, ok: HTMLElement
    beforeEach(() => {
        clock = publicTimePicker(ctxt = new DiContext({
            time: {
                hour: 0,
                minute: 0
            },
            mode: 24,
            width: "100%",
            focusOnInput: true
        }));

        hours = ctxt.getInnerElement<HTMLInputElement>(".atp-hour");
        minutes = ctxt.getInnerElement<HTMLInputElement>(".atp-minute");
        ok = ctxt.getInnerElement(".atp-ok");

        document.body.appendChild(clock.element);
    });
    
    afterEach(() => {
       clock.dispose();
    });

    describe("ArrowUp", () => {
        it("increases hours when up is pressed", function() {
            // arrange
            var ev = createEvent("keydown");
            (<any>ev).key = "Up";

            // act
            hours.dispatchEvent(ev);

            // assert
            clock.getTime().hour.should.be.eql(1);
        });

        it("passes 0 hours when up is pressed", function() {

            // arrange
            var ev = createEvent("keydown");
            (<any>ev).key = "ArrowUp";
            clock.setTime(23 as any, 0 as any);

            // act
            hours.dispatchEvent(ev);

            // assert
            clock.getTime().hour.should.be.eql(0);
        });
        
        it("increases minutes when up is pressed", function() {

            // arrange
            var ev = createEvent("keydown");
            (<any>ev).key = "ArrowUp";

            // act
            minutes.dispatchEvent(ev);

            // assert
            clock.getTime().minute.should.be.eql(1);
        });

        it("passes 0 minutes when up is pressed", function() {

            // arrange
            var ev = createEvent("keydown");
            (<any>ev).key = "ArrowUp";
            clock.setTime(0 as any, 59 as any);

            // act
            minutes.dispatchEvent(ev);

            // assert
            clock.getTime().minute.should.be.eql(0);
        });
    });

    describe("ArrowDown", () => {
        it("decreases hours when down is pressed", function() {

            // arrange
            var ev = createEvent("keydown");
            (<any>ev).key = "ArrowDown";
            clock.setTime(20 as any, 0 as any);

            // act
            hours.dispatchEvent(ev);

            // assert
            clock.getTime().hour.should.be.eql(19);
        });

        it("passes 0 hours when down is pressed", function() {

            // arrange
            var ev = createEvent("keydown");
            (<any>ev).key = "ArrowDown";

            // act
            hours.dispatchEvent(ev);

            // assert
            clock.getTime().hour.should.be.eql(23);
        });
        
        it("decreases minutes when down is pressed", function() {

            // arrange
            var ev = createEvent("keydown");
            (<any>ev).key = "ArrowDown";
            clock.setTime(0 as any, 30 as any);

            // act
            minutes.dispatchEvent(ev);

            // assert
            clock.getTime().minute.should.be.eql(29);
        });

        it("passes 0 minutes when down is pressed", function() {

            // arrange
            var ev = createEvent("keydown");
            (<any>ev).key = "ArrowDown";

            // act
            minutes.dispatchEvent(ev);

            // assert
            clock.getTime().minute.should.be.eql(59);
        });
    });

    describe("ArrowRight", () => {
        it("retains hour focus when right is pressed on first cursor position", function() {

            // arrange
            hours.focus();
            var ev = createEvent("keydown");
            (<any>ev).key = "ArrowRight";
            hours.selectionStart = 1;

            // act
            hours.dispatchEvent(ev);

            // assert
            document.activeElement.should.be.eql(hours);
        });

        it("moves hours focus to minutes when right is pressed on second cursor position", function() {

            // arrange
            hours.focus();
            var ev = createEvent("keydown");
            (<any>ev).key = "ArrowRight";
            hours.selectionStart = 2;

            // act
            hours.dispatchEvent(ev);

            // assert
            document.activeElement.should.be.eql(minutes);
        });
        
        it("retains minutes focus when right is pressed on first cursor position", function() {

            // arrange
            minutes.focus();
            var ev = createEvent("keydown");
            (<any>ev).key = "ArrowRight";
            minutes.selectionStart = 1;

            // act
            minutes.dispatchEvent(ev);

            // assert
            document.activeElement.should.be.eql(minutes);
        });

        it("moves minutes focus to ok when right is pressed on second cursor position", function() {

            // arrange
            minutes.focus();
            var ev = createEvent("keydown");
            (<any>ev).key = "ArrowRight";
            minutes.selectionStart = 2;

            // act
            minutes.dispatchEvent(ev);

            // assert
            document.activeElement.should.be.eql(ok);
        });
    });

    describe("ArrowLeft", () => {        
        it("retains minutes focus when left is pressed on first cursor position", function() {

            // arrange
            minutes.focus();
            var ev = createEvent("keydown");
            (<any>ev).key = "ArrowLeft";
            minutes.selectionStart = 1;

            // act
            minutes.dispatchEvent(ev);

            // assert
            document.activeElement.should.be.eql(minutes);
        });

        it("moves minutes focus to hours when left is pressed on 0th cursor position", function() {

            // arrange
            minutes.focus();
            var ev = createEvent("keydown");
            (<any>ev).key = "ArrowLeft";
            minutes.selectionStart = 0;

            // act
            minutes.dispatchEvent(ev);

            // assert
            document.activeElement.should.be.eql(hours);
        });
    });

    describe("Number key", () => {
        it("sets hour correctly when key pressed on first cursor position", function() {

            // arrange
            hours.focus();
            var ev = createEvent("keydown");
            (<any>ev).key = "1";
            hours.selectionStart = 0;

            // act
            hours.dispatchEvent(ev);

            // assert
            clock.getTime().hour.should.be.eql(10);
        });

        it("sets hour correctly when key pressed on second cursor position", function() {

            // arrange
            hours.focus();
            var ev = createEvent("keydown");
            (<any>ev).key = "1";
            hours.selectionStart = 1;

            // act
            hours.dispatchEvent(ev);

            // assert
            clock.getTime().hour.should.be.eql(1);
        });

        it("sets hour top possible value when cursor on 0th position", function() {

            // arrange
            clock.setTime(19 as any, 0 as any);

            hours.focus();
            var ev = createEvent("keydown");
            (<any>ev).key = "2";
            hours.selectionStart = 0;

            // act
            hours.dispatchEvent(ev);

            // assert
            clock.getTime().hour.should.be.eql(20);
        });

        it("moves hours focus to minutes when key pressed on second cursor position", function() {

            // arrange
            hours.focus();
            var ev = createEvent("keydown");
            (<any>ev).key = "1";
            hours.selectionStart = 1;

            // act
            hours.dispatchEvent(ev);

            // assert
            document.activeElement.should.be.eql(minutes);
        });
        
        it("sets minute correctly when key pressed on first cursor position", function() {

            // arrange
            minutes.focus();
            var ev = createEvent("keydown");
            (<any>ev).key = "1";
            minutes.selectionStart = 0;

            // act
            minutes.dispatchEvent(ev);

            // assert
            clock.getTime().minute.should.be.eql(10);
        });

        it("sets minute correctly when key pressed on second cursor position", function() {

            // arrange
            minutes.focus();
            var ev = createEvent("keydown");
            (<any>ev).key = "1";
            minutes.selectionStart = 1;

            // act
            minutes.dispatchEvent(ev);

            // assert
            clock.getTime().minute.should.be.eql(1);
        });

        it("moves minutes focus to ok when key pressed on second cursor position", function() {

            // arrange
            minutes.focus();
            var ev = createEvent("keydown");
            (<any>ev).key = "1";
            minutes.selectionStart = 1;

            // act
            minutes.dispatchEvent(ev);

            // assert
            document.activeElement.should.be.eql(ok);
        });
    });
});