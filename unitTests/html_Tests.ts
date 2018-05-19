import { offset } from "../src/utils/html";

describe("html.ts", function() {
    describe("Test offset, static", function() {

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
    
    describe("Test offset, fixed", function() {

        let el: HTMLDivElement, padding: HTMLDivElement
        beforeEach((done) => {
            el = document.createElement("div");
            document.body.appendChild(el);

            padding = document.createElement("div");
            padding.style.width = "10000px";
            padding.style.height = "10000px";
            document.body.appendChild(padding);
            
            setTimeout(() => done(), 100);
        });
        
        afterEach(() => {
            document.body.removeChild(el);
            document.body.removeChild(padding);
        });

        it("gets offset from position", function() {

            // arrange
            var newEl = document.createElement("div");
            newEl.style.position = "fixed";
            newEl.style.left = "555px";
            newEl.style.top = "666px";
            window.scrollTo(100, 100);

            el.appendChild(newEl);

            // act
            var o = {
                x: offset(newEl, "offsetLeft"),
                y: offset(newEl, "offsetTop")
            };

            // assert
            o.x.should.be.eql(555);
            o.y.should.be.eql(666);
        });
    });
});