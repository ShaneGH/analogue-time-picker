import { DiContext } from '../../src/di';
import { TimePicker, publicTimePicker } from '../../src/init/publicTimePicker';

describe("touchMoveEvent_tests.ts", () => {

    var clock: TimePicker, ctxt: DiContext
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

    it("alters hours when touch moves", function() {

        // arrange
        var clockElement = ctxt.getInnerElement(".atp-clock");
        var beginEvent = new Event("touchstart");
        (<any>beginEvent).touches = [{
            clientX: 900,
            clientY: 600
        }];
        
        var moveEvent = new Event("touchmove");
        (<any>moveEvent).touches = [{
            clientX: 900,
            clientY: 600
        }];

        // act
        clockElement.dispatchEvent(beginEvent);
        document.dispatchEvent(moveEvent);
        document.dispatchEvent(new Event("touchend"));

        // assert
        clock.getTime().hour.should.not.be.eql(0);
        clock.getTime().minute.should.be.eql(0);
    });

    it("alters minutes when touch moves", function() {

        // arrange
        var clockElement = ctxt.getInnerElement(".atp-clock");
        var beginEvent = new Event("touchstart");
        (<any>beginEvent).touches = [{
            clientX: 100,
            clientY: 200
        }];

        var moveEvent = new Event("touchmove");
        (<any>moveEvent).touches = [{
            clientX: 100,
            clientY: 200
        }];
        clock.showMinutes();

        // act
        clockElement.dispatchEvent(beginEvent);
        document.dispatchEvent(moveEvent);
        document.dispatchEvent(new Event("touchend"));

        // assert
        clock.getTime().minute.should.not.be.eql(0);
        clock.getTime().hour.should.be.eql(0);
    });
});