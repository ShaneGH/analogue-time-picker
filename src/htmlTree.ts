import { append, create, remove } from './template';

var getId = (function() {
    var i = Math.floor(Math.random() * 100000);
    return () => `mtl-${++i}`;
}());

function buildHtmlModel() {
    var id = getId();
    return {
        hour: `hour-${id}`,
        minute: `minute-${id}`,
        am: `am-${id}`,
        pm: `pm-${id}`,
        title: `title-${id}`
    };
}

/** Creates or uses existing element and populates it with the html template */
class HtmlTree {
    dispose: () => void
    element: HTMLElement;

    constructor(rootHtmlElement?: HTMLElement) {
        var id = getId();
        if (!rootHtmlElement) {
            var el = rootHtmlElement = create(buildHtmlModel());

            this.dispose = () => el.parentElement ? 
                el.parentElement.removeChild(el) : 
                null;
        } else {
            var el = rootHtmlElement = append(rootHtmlElement, buildHtmlModel());
            this.dispose = () => remove(el);
        }

        this.element = rootHtmlElement;
    }
}

export {
    HtmlTree
}