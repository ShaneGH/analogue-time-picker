import { getHours, getMinutes } from "../../src/time";
import { AmPm } from "../../src/distance";
import { PublicClock, publicClock } from "../../src/publicClock";
import { DiContext } from "../../src/di";
import { Clock } from "../../src/clock";

describe("get_set_tests.ts", () => {

    var clock: PublicClock, ctxt: DiContext
    beforeEach(() => {
        clock = publicClock(ctxt = new DiContext({
            time: {
                hour: 0,
                minute: 0
            },
            closeOnSelect: false
        }));

        document.body.appendChild(clock.element);
    });
    
    afterEach(() => {
        clock.dispose();

    });

    it("gets and sets time correctly", function() {

        // arrange
        var hour = clock.setTime(23, 12);

        // act
        var time = clock.getTime();

        // assert
        time.hour.should.be.eql(23);
        time.minute.should.be.eql(12);
    });

    it("rounds decimal points", function() {

        // arrange
        var hour = clock.setTime(23.2, 12.5);

        // act
        var time = clock.getTime();

        // assert
        time.hour.should.be.eql(23);
        time.minute.should.be.eql(13);
    });

    it("sets hours input element", function() {

        // arrange
        // act
        var hour = clock.setTime(23, 12);

        // assert
        ctxt.getInnerElement<HTMLInputElement>(".smt-hour").value.should.be.eql("23");
    });

    it("sets minutes input element", function() {

        // arrange
        // act
        var hour = clock.setTime(23, 12);

        // assert
        ctxt.getInnerElement<HTMLInputElement>(".smt-minute").value.should.be.eql("12");
    });

    it("fires time changed event", function(done) {

        // arrange
        clock.onTimeChanged(function (h: any, m: any) {
            // assert
            h.should.be.eql(23);
            m.should.be.eql(12);

            done();
        });

        // act
        var hour = clock.setTime(23, 12);
    });

    it("changes from hours to minutes and sets hand to correct angle", function() {

        // arrange
        // act
        var hour = clock.setTime(23, 12);

        // assert
        var assertHour = () => ctxt
            .buildHandElements()
            .hands
            .forEach(h => (h.style.transform || "").should.be.eql("rotate(1.0472rad)"));

        assertHour();
        
        clock.showMinutes();
        ctxt
            .buildHandElements()
            .hands
            .forEach(h => (h.style.transform || "").should.be.eql("rotate(2.82743rad)"));

        clock.showHours();
        assertHour();
    });
});