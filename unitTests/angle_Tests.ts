
import { getAngle, getAngleDelta } from '../src/utils/angle';

describe("angle.ts", function() {
    describe("Test getAngle", function() {
        describe("places angles in the correct quadrant", function() {

            var w = 100, h = 100, x = 0, y = 0, _90 = Math.PI / 2, _180 = Math.PI, _270 = Math.PI * 3 / 2, _360 = Math.PI * 2;

            function assertQuadrant(angle: number, quadrant: number) {
                while (angle <= 0) angle += 2* Math.PI;

                switch (quadrant) {
                    case 1:
                        angle.should.be.greaterThan(0);
                        angle.should.be.lessThan(_90);
                        break;
                    case 2:
                        angle.should.be.greaterThan(_90);
                        angle.should.be.lessThan(_180);
                        break;
                    case 3:
                        angle.should.be.greaterThan(_180);
                        angle.should.be.lessThan(_270);
                        break;
                    case 4:
                        angle.should.be.greaterThan(_270);
                        angle.should.be.lessThan(_360);
                        break;
                    default:
                        throw new Error("Invalid quadrant");
                }
            }

            it("should be in quadrant 1", function(){

                // arrange
                // act
                var angle = getAngle(x, y, w, h);

                // asert
                assertQuadrant(angle, 1);
            });

            it("should be in quadrant 2", function(){

                // arrange
                // act
                var angle = getAngle(x + w, y, w, h);

                // asert
                assertQuadrant(angle, 2);
            });

            it("should be in quadrant 3", function(){

                // arrange
                // act
                var angle = getAngle(x + w, y + h, w, h);

                // asert
                assertQuadrant(angle, 3);
            });

            it("should be in quadrant 4", function(){

                // arrange
                // act
                var angle = getAngle(x, y + h, w, h);

                // asert
                assertQuadrant(angle, 4);
            });
        });
        
        describe("calculates angles correctly", function() {

            it("should be 45", function(){

                // arrange
                // act
                var angle = getAngle(0, 0, 100, 100);

                // asert
                angle.should.be.eql(Math.PI / 4);
            });

            it("should be 45, 2", function(){

                // arrange
                // act
                var angle = getAngle(10, 10, 100, 100);

                // asert
                angle.should.be.eql(Math.PI / 4);
            });

            // it("should be 30", function(){

            //     // arrange
            //     // act

            //     var angle = getAngle(50 - 10, 50 - 5.235987755982988, 100, 100);

            //     // asert
            //     angle.should.be.eql(Math.PI / 6);
            // });

            // it("should be 60", function(){

            //     // arrange
            //     // act
            //     var angle = getAngle(50- 10, 50- 8.08448792630022, 100, 100);

            //     // asert
            //     angle.should.be.eql(Math.PI / 3);
            // });
        });
    });

    describe("Test getAngleDelta", function() {
        it("gets correct positive delta", function() {

            // arrange
            // act
            var delta = getAngleDelta(1, 1.1);

            // assert
            parseFloat(delta.toFixed(5)).should.be.eql(0.1);
        });
        
        it("gets correct negative delta", function() {

            // arrange
            // act
            var delta = getAngleDelta(1, 0.9);

            // assert
            parseFloat(delta.toFixed(5)).should.be.eql(-0.1);
        });
        
        it("gets correct delta > 360", function() {

            // arrange
            // act
            var delta = getAngleDelta(1, 0.2 + 1 + Math.PI * 2);

            // assert
            parseFloat(delta.toFixed(5)).should.be.eql(0.2);
        });
        
        it("gets correct negative delta > 360", function() {

            // arrange
            // act
            var delta = getAngleDelta(1, -0.2 + 1 + Math.PI * 2);

            // assert
            parseFloat(delta.toFixed(5)).should.be.eql(-0.2);
        });
    });
});