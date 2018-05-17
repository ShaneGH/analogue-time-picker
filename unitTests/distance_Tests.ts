import { getAMPM, AmPm } from "../src/utils/distance";

describe("distance.ts", function() {
    describe("Test getAMPM", function() {
        it("gets AM when at border 1", function() {

            // arrange
            // act
            var amPm = getAMPM(0, 0, 300, 300, 16);

            // assert
            amPm.should.be.eql(AmPm.am);
        });
        
        it("gets AM when at border 2", function() {

            // arrange
            // act
            var amPm = getAMPM(300, 300, 300, 300, 16);

            // assert
            amPm.should.be.eql(AmPm.am);
        });
        
        it("gets AM when outside border 1", function() {

            // arrange
            // act
            var amPm = getAMPM(-10, -10, 300, 300, 16);

            // assert
            amPm.should.be.eql(AmPm.am);
        });
        
        it("gets AM when outside border 2", function() {

            // arrange
            // act
            var amPm = getAMPM(310, 310, 300, 300, 16);

            // assert
            amPm.should.be.eql(AmPm.am);
        });

        it("gets PM when close to center 1", function() {

            // arrange
            // act
            var amPm = getAMPM(140, 140, 300, 300, 16);

            // assert
            amPm.should.be.eql(AmPm.pm);
        });

        it("gets PM when close to center 2", function() {

            // arrange
            // act
            var amPm = getAMPM(160, 160, 300, 300, 16);

            // assert
            amPm.should.be.eql(AmPm.pm);
        });
    });
});