import { create, TimePickerModalData } from '../../src/init/timePickerModal';

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

    var validInput: TimePickerModalData
    beforeEach(() => {
        validInput = {
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

        // cleanup
        tp.dispose();
    });

    it("shows modal on open", function() {

        // arrange
        document.getElementsByClassName("atp-modal").length.should.be.eql(0);

        // act
        var tp = create(validInput);
        
        // assert
        document.getElementsByClassName("atp-modal").length.should.be.eql(1);
        document.getElementsByClassName("atp-modal")[0].querySelectorAll(".atp").length.should.be.eql(1);

        // cleanup
        tp.dispose();
    });

    it("hides modal on cancel", function() {

        // arrange
        // act
        var tp = create(validInput);
        tp.cancel();
        
        // assert
        document.getElementsByClassName("atp-modal").length.should.be.eql(0);
    });

    it("hides modal on ok", function() {

        // arrange
        // act
        var tp = create(validInput);
        tp.ok();
        
        // assert
        document.getElementsByClassName("atp-modal").length.should.be.eql(0);
    });

    it("hides modal on dispose", function() {

        // arrange
        // act
        var tp = create(validInput);
        tp.dispose();
        
        // assert
        document.getElementsByClassName("atp-modal").length.should.be.eql(0);
    });
});