import { DiContext } from '../../src/di';
import { TimePicker, publicTimePicker } from '../../src/init/publicTimePicker';

describe("12hr_Tests.ts", () => {

    var clock: TimePicker, ctxt: DiContext
    beforeEach(() => {
        clock = publicTimePicker(ctxt = new DiContext({
            time: {
                hour: 0,
                minute: 0
            },
            mode: 12,
            width: "100%",
            focusOnInput: true
        }));

        document.body.appendChild(clock.element);
    });
    
    afterEach(() => {
        clock.dispose();
    });

    it("sets time correctly in 12hr mode, 1", function() {

        // arrange
        // act
        clock.setTime(1 as any, 20 as any);

        // assert
        clock.getTime().hour.should.be.eql(1);
        clock.getTime().minute.should.be.eql(20);
    });

    it("sets time correctly in 12hr mode, 2", function() {

        // arrange
        // act
        clock.setTime(13 as any, 20 as any);

        // assert
        clock.getTime().hour.should.be.eql(13);
        clock.getTime().minute.should.be.eql(20);
    });

    it("shows user time in 12hr mode", function() {

        // arrange
        // act
        clock.setTime(13 as any, 20 as any);

        // assert
        ctxt.getInnerElement<HTMLInputElement>(".atp-hour").value.should.be.eql("1");
    });

    it("should highlight pm when pm time set", function() {

        // arrange
        // act
        clock.setTime(13 as any, 20 as any);

        // assert
        var ok = false;
        for (var i = 0; i < ctxt.buildHoursElements().pm.attributes.length; i++) {
            if (ctxt.buildHoursElements().pm.attributes[i].name === "aria-pressed") {
                ok = true;
                return;
            }
        }

        if (!ok) throw new Error("FAIL 1");
        
        for (var i = 0; i < ctxt.buildHoursElements().am.attributes.length; i++) {
            if (ctxt.buildHoursElements().am.attributes[i].name === "aria-pressed") {
                throw new Error("FAIL 2")
            }
        }
    });

    it("should highlight am when am time set", function() {

        // arrange
        // act
        clock.setTime(1 as any, 20 as any);

        // assert
        var ok = false;
        for (var i = 0; i < ctxt.buildHoursElements().am.attributes.length; i++) {
            if (ctxt.buildHoursElements().am.attributes[i].name === "aria-pressed") {
                ok = true;
                return;
            }
        }

        if (!ok) throw new Error("FAIL 1");
        
        for (var i = 0; i < ctxt.buildHoursElements().pm.attributes.length; i++) {
            if (ctxt.buildHoursElements().pm.attributes[i].name === "aria-pressed") {
                throw new Error("FAIL 2")
            }
        }
    });
});