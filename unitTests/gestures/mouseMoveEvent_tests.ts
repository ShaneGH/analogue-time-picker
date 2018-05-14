import { getHours, getMinutes } from "../../src/time";
import { AmPm } from "../../src/distance";
import { PublicClock, publicClock } from "../../src/publicClock";
import { DiContext } from "../../src/di";
import { Clock } from "../../src/clock";

describe("mouseMoveEvent_tests.ts", () => {

    var clock: PublicClock, ctxt: DiContext
    beforeEach(() => {
        clock = publicClock(ctxt = new DiContext({
            time: {
                hour: 0,
                minute: 0
            },
            closeOnSelect: true
        }));

        clock.element.style.width = "600px";
        clock.element.style.top = "0";
        clock.element.style.left = "0";
        clock.element.style.position = "fixed";
        document.body.insertBefore(clock.element, document.body.firstChild);
    });
    
    afterEach(() => {
       clock.dispose();
    });

    // Note, these tests aren't really verifyable.
    // They are just smoke tests and to see if anything has changed

    it("alters hours when mouse moves", function() {

        // arrange
        var clockElement = ctxt.getInnerElement(".smt-clock");
        var moveEvent = new Event("mousemove");
        (<any>moveEvent).clientX = 900;
        (<any>moveEvent).clientY = 600;

        // act
        clockElement.dispatchEvent(new Event("mousedown"));
        document.dispatchEvent(moveEvent);
        document.dispatchEvent(new Event("mouseup"));

        // assert
        clock.getTime().hour.should.not.be.eql(0);
        clock.getTime().minute.should.be.eql(0);
    });

    it("alters minutes when mouse moves", function() {

        // arrange
        var clockElement = ctxt.getInnerElement(".smt-clock");
        var moveEvent = new Event("mousemove");
        (<any>moveEvent).clientX = 100;
        (<any>moveEvent).clientY = 200;
        clock.showMinutes();

        // act
        clockElement.dispatchEvent(new Event("mousedown"));
        document.dispatchEvent(moveEvent);
        document.dispatchEvent(new Event("mouseup"));

        // assert
        clock.getTime().minute.should.not.be.eql(0);
        clock.getTime().hour.should.be.eql(0);
    });
});