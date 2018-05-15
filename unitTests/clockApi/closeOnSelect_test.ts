import { getHours, getMinutes } from "../../src/time";
import { AmPm } from "../../src/distance";
import { PublicClock, publicClock } from "../../src/publicClock";
import { DiContext } from "../../src/di";
import { Clock } from "../../src/clock";

describe("closeOnSelect_Tests.ts", () => {

    var clock: PublicClock, ctxt: DiContext
    beforeEach(() => {
        clock = publicClock(ctxt = new DiContext({
            time: {
                hour: 0,
                minute: 0
            },
            closeOnSelect: true
        }));

        document.body.appendChild(clock.element);
    });
    
    afterEach(() => {
        clock.dispose();
    });

    it("disposes on select", function(done) {

        // arrange
        clock.showMinutes();
        var minutes = ctxt.getInnerElement<HTMLInputElement>(".mtl-minute");
        minutes.selectionStart = 3;
        var ev = new Event("keydown");
        (<any>ev).key = "ArrowRight";

        // assert
        clock.onDispose(() => done());

        // act
        minutes.dispatchEvent(ev);
    });

    it("calls ok on select", function(done) {

        // arrange
        clock.showMinutes();
        clock.setTime(22, 23);
        var minutes = ctxt.getInnerElement<HTMLInputElement>(".mtl-minute");
        minutes.selectionStart = 3;
        var ev = new Event("keydown");
        (<any>ev).key = "ArrowRight";

        // assert
        clock.onOk((h: number, m: number) => {
            h.should.be.eql(22);
            m.should.be.eql(23);

            done();
        });

        // act
        minutes.dispatchEvent(ev);
    });

    it("closes on select", function() {

        // arrange
        clock.showMinutes();
        var minutes = ctxt.getInnerElement<HTMLInputElement>(".mtl-minute");
        minutes.selectionStart = 3;
        var ev = new Event("keydown");
        (<any>ev).key = "ArrowRight";

        // act
        minutes.dispatchEvent(ev);

        // assert
        if (ctxt.getRootElement().parentElement) throw new Error("Should be null");
    });
});