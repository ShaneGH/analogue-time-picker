import { offset } from "../src/html";

describe("html.ts", function() {
    describe("Test offset", function() {

        let el: HTMLDivElement
        beforeEach(() => {
            el = document.createElement("div");
            el.style.position = "fixed";
            el.style.top = "0";
            el.style.left = "0";
            document.body.appendChild(el);
        });
        
        afterEach(() => {
            document.body.removeChild(el);
        });

        it("gets offset from padding", function() {

            // arrange
            el.style.paddingTop = "111px";
            el.style.paddingLeft = "222px";

            var newEl = document.createElement("div");
            el.appendChild(newEl);

            // act
            var o = {
                x: offset(newEl, "offsetLeft"),
                y: offset(newEl, "offsetTop")
            };

            // assert
            o.x.should.be.eql(222);
            o.y.should.be.eql(111);
        });

        it("gets offset from margin", function() {

            // arrange
            el.style.marginTop = "333px";
            el.style.marginLeft = "444px";

            var newEl = document.createElement("div");
            el.appendChild(newEl);

            // act
            var o = {
                x: offset(newEl, "offsetLeft"),
                y: offset(newEl, "offsetTop")
            };

            // assert
            o.x.should.be.eql(444);
            o.y.should.be.eql(333);
        });

        it("gets offset from position", function() {

            // arrange
            el.style.top = "555px";
            el.style.left = "666px";

            var newEl = document.createElement("div");
            el.appendChild(newEl);

            // act
            var o = {
                x: offset(newEl, "offsetLeft"),
                y: offset(newEl, "offsetTop")
            };

            // assert
            o.x.should.be.eql(666);
            o.y.should.be.eql(555);
        });
    });
});