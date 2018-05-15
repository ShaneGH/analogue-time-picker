import { getHours, getMinutes } from "../../src/time";
import { AmPm } from "../../src/distance";
import { PublicClock, publicClock } from "../../src/publicClock";
import { DiContext } from "../../src/di";
import { Clock } from "../../src/clock";

describe("publicEvents_tests.ts", () => {

    var clock: PublicClock, ctxt: DiContext
    beforeEach(() => {
        clock = publicClock(ctxt = new DiContext({
            time: {
                hour: 0,
                minute: 0
            },
            closeOnSelect: false,
            mode: 24
        }));

        document.body.appendChild(clock.element);
    });
    
    afterEach(() => {
        clock.dispose();

    });

    it("fires time changed event", function(done) {

        // arrange
        clock.onTimeChanged((h: any, m: any) => {
            // assert
            h.should.be.eql(23);
            m.should.be.eql(12);

            done();
        });

        // act
        clock.setTime(23, 12);
    });

    it("fires ok event", function(done) {

        // arrange
        clock.onOk(() => {
            // assert
            done();
        });

        // act
        clock.ok();
    });

    it("fires cancel event", function(done) {

        // arrange
        clock.onCancel(() => {
            // assert
            done();
        });

        // act
        clock.cancel();
    });

    it("fires dispose event", function(done) {

        // arrange
        clock.onDispose(() => {
            // assert
            done();
        });

        // act
        clock.dispose();
    });

    it("closes on select", function() {

        // arrange
        // act
        clock.dispose();

        // assert
        if (ctxt.getRootElement().parentElement) throw new Error("Should be null");
    });
});