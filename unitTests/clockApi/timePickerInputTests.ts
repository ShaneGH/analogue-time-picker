import { create, TimePickerInputData } from '../../src/init/timePickerInput';

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

    var input: HTMLInputElement
    var validInput: TimePickerInputData
    beforeEach(() => {
        input = document.createElement("input");
        input.type = "text";
        document.body.appendChild(input);

        validInput = {
            inputElement: input,
            time: {
                hour: 12 as any,
                minute: 30 as any
            },
            mode: 24 as any
        };
    });

    afterEach(() => { document.body.removeChild(input); });

    it("creates time with given time", function() {

        // arrange
        // act
        var tp = create(validInput);
        
        // assert
        (tp.getTime() as any).hour.should.eql(12);
        (tp.getTime() as any).minute.should.eql(30);

        // cleanup
        tp.dispose();
    });

    it("creates time with default time", function() {

        // arrange
        input.value = "10:33 PM";
        validInput.time = undefined;

        // act
        var tp = create(validInput);
        
        // assert
        (tp.getTime() as any).hour.should.eql(22);
        (tp.getTime() as any).minute.should.eql(33);

        // cleanup
        tp.dispose();
    });

    it("sets time correctly", function() {

        // arrange
        validInput.time = undefined;

        // act
        var tp = create(validInput);
        tp.setTime(11 as any, 22 as any);
        
        // assert
        (tp.getTime() as any).hour.should.eql(11);
        (tp.getTime() as any).minute.should.eql(22);

        // cleanup
        tp.dispose();
    });

    it("opens modal on focus", function() {

        // arrange
        document.getElementsByClassName("mtl-modal").length.should.be.eql(0);
        var tp = create(validInput);
        
        // act
        (validInput.inputElement as any).focus();
        
        // assert
        document.getElementsByClassName("mtl-modal").length.should.be.eql(1);

        // cleanup
        tp.dispose();
    });

    it("closes modal with on ok", function() {

        // arrange
        document.getElementsByClassName("mtl-modal").length.should.be.eql(0);
        var tp = create(validInput);
        (validInput.inputElement as any).focus();
        
        // act
        document.getElementsByClassName("mtl-modal").length.should.be.eql(1);
        document.getElementsByClassName("mtl-ok")[0].dispatchEvent(new Event("click"));
        
        // assert
        document.getElementsByClassName("mtl-modal").length.should.be.eql(0);

        // cleanup
        tp.dispose();
    });

    it("closes modal on dispose", function() {

        // arrange
        document.getElementsByClassName("mtl-modal").length.should.be.eql(0);
        var tp = create(validInput);
        (validInput.inputElement as any).focus();
        document.getElementsByClassName("mtl-modal").length.should.be.eql(1);
        
        // act
        tp.dispose();
        
        // assert
        document.getElementsByClassName("mtl-modal").length.should.be.eql(0);
    });

    it("closes modal with correct time on ok", function() {

        // arrange
        document.getElementsByClassName("mtl-ok").length.should.be.eql(0);
        var tp = create(validInput);
        (validInput.inputElement as any).focus();
        
        // act
        document.getElementsByClassName("mtl-hour")[0].dispatchEvent(new KeyboardEvent("keydown", {key: "1"}));
        document.getElementsByClassName("mtl-hour")[0].dispatchEvent(new KeyboardEvent("keydown", {key: "4"}));
        document.getElementsByClassName("mtl-minute")[0].dispatchEvent(new KeyboardEvent("keydown", {key: "2"}));
        document.getElementsByClassName("mtl-minute")[0].dispatchEvent(new KeyboardEvent("keydown", {key: "2"}));
        document.getElementsByClassName("mtl-ok")[0].dispatchEvent(new Event("click"));
        
        // assert
        (validInput.inputElement as any).value.should.be.eql("14:22");

        // cleanup
        tp.dispose();
    });

    // it("shows modal on open", function() {

    //     // arrange
    //     document.getElementsByClassName("mtl-modal").length.should.be.eql(0);

    //     // act
    //     var tp = create(validInput);
        
    //     // assert
    //     document.getElementsByClassName("mtl-modal").length.should.be.eql(1);
    //     document.getElementsByClassName("mtl-modal")[0].querySelectorAll(".mtl").length.should.be.eql(1);

    //     // cleanup
    //     tp.dispose();
    // });

    // it("hides modal on cancel", function() {

    //     // arrange
    //     // act
    //     var tp = create(validInput);
    //     tp.cancel();
        
    //     // assert
    //     document.getElementsByClassName("mtl-modal").length.should.be.eql(0);
    // });

    // it("hides modal on ok", function() {

    //     // arrange
    //     // act
    //     var tp = create(validInput);
    //     tp.ok();
        
    //     // assert
    //     document.getElementsByClassName("mtl-modal").length.should.be.eql(0);
    // });

    // it("hides modal on dispose", function() {

    //     // arrange
    //     // act
    //     var tp = create(validInput);
    //     tp.dispose();
        
    //     // assert
    //     document.getElementsByClassName("mtl-modal").length.should.be.eql(0);
    // });
});