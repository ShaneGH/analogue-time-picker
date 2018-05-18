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

describe("timePickerInputTests.ts", () => {

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
        document.getElementsByClassName("atp-modal").length.should.be.eql(0);
        var tp = create(validInput);
        
        // act
        (validInput.inputElement as any).focus();
        
        // assert
        document.getElementsByClassName("atp-modal").length.should.be.eql(1);

        // cleanup
        tp.dispose();
    });

    it("closes modal with on ok", function() {

        // arrange
        document.getElementsByClassName("atp-modal").length.should.be.eql(0);
        var tp = create(validInput);
        (validInput.inputElement as any).focus();
        
        // act
        document.getElementsByClassName("atp-modal").length.should.be.eql(1);
        document.getElementsByClassName("atp-ok")[0].dispatchEvent(new Event("click"));
        
        // assert
        document.getElementsByClassName("atp-modal").length.should.be.eql(0);

        // cleanup
        tp.dispose();
    });

    it("closes modal on dispose", function() {

        // arrange
        document.getElementsByClassName("atp-modal").length.should.be.eql(0);
        var tp = create(validInput);
        (validInput.inputElement as any).focus();
        document.getElementsByClassName("atp-modal").length.should.be.eql(1);
        
        // act
        tp.dispose();
        
        // assert
        document.getElementsByClassName("atp-modal").length.should.be.eql(0);
    });

    it("closes modal with correct time on ok", function() {

        // arrange
        document.getElementsByClassName("atp-ok").length.should.be.eql(0);
        var tp = create(validInput);
        (validInput.inputElement as any).focus();
        
        // act
        document.getElementsByClassName("atp-hour")[0].dispatchEvent(new KeyboardEvent("keydown", {key: "1"}));
        document.getElementsByClassName("atp-hour")[0].dispatchEvent(new KeyboardEvent("keydown", {key: "4"}));
        document.getElementsByClassName("atp-minute")[0].dispatchEvent(new KeyboardEvent("keydown", {key: "2"}));
        document.getElementsByClassName("atp-minute")[0].dispatchEvent(new KeyboardEvent("keydown", {key: "2"}));
        document.getElementsByClassName("atp-ok")[0].dispatchEvent(new Event("click"));
        
        // assert
        (validInput.inputElement as any).value.should.be.eql("14:22");

        // cleanup
        tp.dispose();
    });
});