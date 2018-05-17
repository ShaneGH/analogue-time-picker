import { create } from './template';

var getId = (function() {
    var i = Math.floor(Math.random() * 100000);
    return () => `mtl-${++i}`;
}());

function buildHtmlModel() {
    var id = getId();
    return {
        hour: `${id}-hour`,
        minute: `${id}-minute`,
        am: `${id}-am`,
        pm: `${id}-pm`,
        title: `${id}-title`
    };
}

function getPxValue(width: string) {
    // if value has no units, interpret as px
    if (/^\s*\d+(\.\d*)?\s*$/.test(width)) width += "px";
    
    if (/px\s*$/.test(width)) return parseFloat(width);

    var test = document.createElement("div");
    test.style.width = width;

    document.body.appendChild(test);
    var w = test.offsetWidth;
    document.body.removeChild(test);

    return w;
}

const fontMultiplier = 4 / 75;
function getFontSize(width: string) {
    // don't set font size for em or %
    if (/(em|%)\s*$/.test(width)) return null;

    var widthPx = getPxValue(width);
    if (isNaN(widthPx)) throw new Error(`Invalid width value: ${width}`);
    if (widthPx <= 0) console.warn(`Width value "${width}" came to ${widthPx}px`);

    return widthPx * fontMultiplier;
}

/** Creates or uses existing element and populates it with the html template */
class HtmlTree {
    element: HTMLElement;

    constructor(width: string, rootHtmlElement?: HTMLElement) {
        this.element = create(buildHtmlModel());
        if (rootHtmlElement) {
            rootHtmlElement.innerHTML = "";
            rootHtmlElement.appendChild(this.element);
        }
        
        this.setWidth(width);
    }

    setWidth(widthValue: string) {
        this.element.style.width = widthValue;
        var fs = getFontSize(widthValue);
        this.element.style.fontSize = fs != null ? `${fs}px` : null;
    }

    dispose() {
        if (this.element.parentElement) {
            this.element.parentElement.removeChild(this.element);
        }
    }
}

export {
    HtmlTree
}