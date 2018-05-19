import { DiContext } from '../../src/di';
import { TimePicker as PublicClock, publicTimePicker } from '../../src/init/publicTimePicker';

describe("get_set_tests.ts", () => {

    var clock: PublicClock, ctxt: DiContext
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

        document.body.appendChild(clock.element);
    });
    
    afterEach(() => {
        clock.dispose();

    });

    it("gets and sets time correctly", function() {

        // arrange
        var hour = clock.setTime(23 as any, 12 as any);

        // act
        var time = clock.getTime();

        // assert
        time.hour.should.be.eql(23);
        time.minute.should.be.eql(12);
    });

    it("removes decimal points", function() {

        // arrange
        var hour = clock.setTime(23.2 as any, 12.8 as any);

        // act
        var time = clock.getTime();

        // assert
        time.hour.should.be.eql(23);
        time.minute.should.be.eql(12);
    });

    it("sets hours input element", function() {

        // arrange
        // act
        var hour = clock.setTime(23 as any, 12 as any);

        // assert
        ctxt.getInnerElement<HTMLInputElement>(".atp-hour").value.should.be.eql("23");
    });

    it("sets minutes input element", function() {

        // arrange
        // act
        var hour = clock.setTime(23 as any, 12 as any);

        // assert
        ctxt.getInnerElement<HTMLInputElement>(".atp-minute").value.should.be.eql("12");
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
        var hour = clock.setTime(23 as any, 12 as any);
    });

    it("changes from hours to minutes and sets hand to correct angle", function() {

        // arrange
        // act
        var hour = clock.setTime(23 as any, 12 as any);

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