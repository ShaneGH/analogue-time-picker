import { Clock } from '../../src/init/publicClock';
import { create, TimePickerData } from '../../src/init/timePicker';

function expectError(f: () => void) {
    var ok = true;
    try {
        f();
    } catch {
        ok = false;
    }

    ok.should.be.eql(false, "exected an error");
}

describe("timePicker_Tests.ts", () => {

    var validInput: TimePickerData
    beforeEach(() => {
        validInput = {
            element: document.createElement("div"),
            time: {
                hour: 12 as any,
                minute: 30 as any
            },
            mode: 24 as any
        };
    });

    it("creates time with valid args", function() {

        // arrange
        // act
        var tp = create(validInput);
        
        // assert
        tp.getTime().hour.should.eql(12);
        tp.getTime().minute.should.eql(30);
    });

    describe("input args", () => {
        describe("element", () => {

            it("creates time with no element", function() {

                // arrange
                validInput.element = undefined;

                // act
                var tp = create(validInput);
                
                // assert
                tp.element.tagName.should.eql("DIV");
            });

            it("creates time with invalid element", function() {

                // arrange
                validInput.element = "Hello" as any;

                // act
                // assert
                expectError(() => create(validInput));
            });
        });

        describe("hour", () => {

            it("creates time with no hour", function() {

                // arrange
                (validInput.time as any).hour = undefined;

                // act
                var tp = create(validInput);
                
                // assert
                tp.getTime().hour.should.eql(0);
                tp.getTime().minute.should.eql(30);
            });

            it("creates time with hour as string", function() {

                // arrange
                (validInput.time as any).hour = "22";

                // act
                var tp = create(validInput);
                
                // assert
                tp.getTime().hour.should.eql(22);
                tp.getTime().minute.should.eql(30);
            });

            it("throws error with negative hour", function() {

                // arrange
                (validInput.time as any).hour = -1;

                // act
                // assert
                expectError(() => create(validInput));
            });

            it("throws error with hour too large", function() {

                // arrange
                (validInput.time as any).hour = 24;

                // act
                // assert
                expectError(() => create(validInput));
            });
        });

        describe("minute", () => {

            it("creates time with no minute", function() {

                // arrange
                (validInput.time as any).minute = undefined;

                // act
                var tp = create(validInput);
                
                // assert
                tp.getTime().hour.should.eql(12);
                tp.getTime().minute.should.eql(0);
            });

            it("creates time with minute as string", function() {

                // arrange
                (validInput.time as any).minute = "22";

                // act
                var tp = create(validInput);
                
                // assert
                tp.getTime().hour.should.eql(12);
                tp.getTime().minute.should.eql(22);
            });

            it("throws error with negative minute", function() {

                // arrange
                (validInput.time as any).minute = -1;

                // act
                // assert
                expectError(() => create(validInput));
            });

            it("throws error with minute too large", function() {

                // arrange
                (validInput.time as any).minute = 60;

                // act
                // assert
                expectError(() => create(validInput));
            });
        });

        describe("mode", () => {

            it("creates time with 12h mode", function() {

                // arrange
                validInput.mode = 12 as any;

                // act
                var tp = create(validInput);
                
                // assert
                tp.getTime().hour.should.eql(12);
                tp.getTime().minute.should.eql(30);
            });

            it("creates time with 24h mode (string)", function() {

                // arrange
                validInput.mode = "24" as any;

                // act
                var tp = create(validInput);
                
                // assert
                tp.getTime().hour.should.eql(12);
                tp.getTime().minute.should.eql(30);
            });

            it("creates time with 12h mode (string)", function() {

                // arrange
                validInput.mode = "12" as any;

                // act
                var tp = create(validInput);
                
                // assert
                tp.getTime().hour.should.eql(12);
                tp.getTime().minute.should.eql(30);
            });

            it("throws error with invalid mode", function() {

                // arrange
                validInput.mode = 13 as any;

                // act
                // assert
                expectError(() => create(validInput));
            });
        });

        describe("time", () => {

            it("creates time with no time", function() {

                // arrange
                validInput.time = undefined;

                // act
                var tp = create(validInput);
                
                // assert
                tp.getTime().hour.should.eql(0);
                tp.getTime().minute.should.eql(0);
            });

            it("creates time with time as date", function() {

                // arrange
                validInput.time = new Date(2000, 1, 1, 13, 13);

                // act
                var tp = create(validInput);
                
                // assert
                tp.getTime().hour.should.eql(13);
                tp.getTime().minute.should.eql(13);
            });
        });

        describe("setTime", () => {

            var clock: Clock
            beforeEach(() => {
                clock = create(validInput)
            });

            it("sets time with valid inputs", function() {

                // arrange
                // act
                clock.setTime(15 as any, 16 as any);
                
                // assert
                clock.getTime().hour.should.eql(15);
                clock.getTime().minute.should.eql(16);
            });

            it("sets time with hour as string", function() {

                // arrange
                // act
                clock.setTime("15" as any, 16 as any);
                
                // assert
                clock.getTime().hour.should.eql(15);
                clock.getTime().minute.should.eql(16);
            });

            it("sets time with minute as string", function() {

                // arrange
                // act
                clock.setTime(15 as any, "16" as any);
                
                // assert
                clock.getTime().hour.should.eql(15);
                clock.getTime().minute.should.eql(16);
            });

            it("throws error with no args", function() {

                // arrange
                // act
                // assert
                expectError(() => clock.setTime());
            });

            it("throws error with no minute", function() {

                // arrange
                // act
                // assert
                expectError(() => clock.setTime(15 as any));
            });

            it("throws error with no hour", function() {

                // arrange
                // act
                // assert
                expectError(() => clock.setTime(undefined, 16 as any));
            });

            it("throws error with invalid hour", function() {

                // arrange
                // act
                // assert
                expectError(() => clock.setTime({}, 16 as any));
            });

            it("throws error with invalid minute", function() {

                // arrange
                // act
                // assert
                expectError(() => clock.setTime(15 as any, {}));
            });

            it("throws error with negative hour", function() {

                // arrange
                // act
                // assert
                expectError(() => clock.setTime(-1 as any, 16 as any));
            });

            it("throws error with negative minute", function() {

                // arrange
                // act
                // assert
                expectError(() => clock.setTime(15 as any, -1 as any));
            });

            it("throws error with hour too large", function() {

                // arrange
                // act
                // assert
                expectError(() => clock.setTime(24 as any, 16 as any));
            });

            it("throws error with minute too large", function() {

                // arrange
                // act
                // assert
                expectError(() => clock.setTime(15 as any, 60 as any));
            });
        });
    });
});