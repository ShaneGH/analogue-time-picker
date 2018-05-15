import { getHours, getMinutes, convert24hTo12h, convert12hTo24h } from "../src/time";
import { AmPm } from "../src/distance";

describe("time.ts", () => {
    describe("Test getHours", function() {
        it("gets correct hour and hand angle for 0°, AM", function() {

            // arrange
            // act
            var hour = getHours(0, AmPm.am);

            // assert
            hour.hour.should.be.eql(9);
            hour.handAngle.should.be.eql(0);
        });
        
        it("gets correct hour and hand angle for 0°, PM", function() {

            // arrange
            // act
            var hour = getHours(0, AmPm.pm);

            // assert
            hour.hour.should.be.eql(21);
            hour.handAngle.should.be.eql(0);
        });

        it("gets correct hour and hand angle for 150°, AM", function() {

            // arrange
            // act
            var hour = getHours(2.617993877991494, AmPm.am);

            // assert
            hour.hour.should.be.eql(2);
            hour.handAngle.should.be.eql(2.617993877991494);
        });
        
        it("gets correct hour and hand angle for 0°, PM", function() {

            // arrange
            // act
            var hour = getHours(2.617993877991494, AmPm.pm);

            // assert
            hour.hour.should.be.eql(14);
            hour.handAngle.should.be.eql(2.617993877991494);
        });
        
        it("snaps to correct angle, forwards", function() {

            // arrange
            // act
            var hour = getHours(2.617993877991494 - 0.01, AmPm.pm);

            // assert
            hour.hour.should.be.eql(14);
            hour.handAngle.should.be.eql(2.617993877991494);
        });
        
        it("snaps to correct angle, backwards", function() {

            // arrange
            // act
            var hour = getHours(2.617993877991494 + 0.01, AmPm.pm);

            // assert
            hour.hour.should.be.eql(14);
            hour.handAngle.should.be.eql(2.617993877991494);
        });
    });

    describe("Test getMinutes", function() {
        it("gets correct minute and hand angle for 0°,", function() {

            // arrange
            // act
            var minute = getMinutes(0);

            // assert
            minute.minute.should.be.eql(45);
            minute.handAngle.should.be.eql(0);
        });

        it("gets correct minute and hand angle for 150°,", function() {

            // arrange
            // act
            var minute = getMinutes(2.722713633111154);

            // assert
            minute.minute.should.be.eql(11);
            minute.handAngle.should.be.eql(2.722713633111154);
        });
        
        it("snaps to correct angle, forwards", function() {

            // arrange
            // act
            var minute = getMinutes(2.722713633111154 - 0.001);

            // assert
            minute.minute.should.be.eql(11);
            minute.handAngle.should.be.eql(2.722713633111154);
        });
        
        it("snaps to correct angle, backwards", function() {

            // arrange
            // act
            var minute = getMinutes(2.722713633111154 + 0.001);

            // assert
            minute.minute.should.be.eql(11);
            minute.handAngle.should.be.eql(2.722713633111154);
        });
    });

    describe("Test convert24hTo12h", function() {
        it("Infers am/pm if none specified", function() {

            // arrange
            // act
            // assert
            convert24hTo12h(10).should.be.eql(10, "1");
            convert24hTo12h(22).should.be.eql(10, "2");
        });
        
        it("Uses converts 12 and 24 values correctly", function() {

            // arrange
            // act
            // assert
            convert24hTo12h(12).should.be.eql(12, "1");
            convert24hTo12h(0).should.be.eql(12, "2");
        });
        
        it("Truncates value", function() {

            // arrange
            // act
            // assert
            convert24hTo12h(3).should.be.eql(3, "1");
            convert24hTo12h(15).should.be.eql(3, "2");
        });
    });

    describe("Test convert12hTo24h", function() {
        
        it("Uses converts 12 and 24 values correctly", function() {

            // arrange
            // act
            // assert
            convert12hTo24h(12, AmPm.am).should.be.eql(12);
            convert12hTo24h(12, AmPm.pm).should.be.eql(0);
        });
        
        it("Uses converts to am value", function() {

            // arrange
            // act
            // assert
            convert12hTo24h(3, AmPm.am).should.be.eql(3);
        });
        
        it("Uses converts to pm value", function() {

            // arrange
            // act
            // assert
            convert12hTo24h(3, AmPm.pm).should.be.eql(15);
        });
    });
});