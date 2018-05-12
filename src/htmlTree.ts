import { create, append, remove } from "./template";

class HtmlTree {
    dispose: () => void
    element: HTMLElement;

    constructor(rootHtmlElement?: HTMLElement) {
        if (!rootHtmlElement) {
            var el = rootHtmlElement = create();
            this.dispose = () => el.parentElement ? 
                el.parentElement.removeChild(el) : 
                null;
        } else {
            var el = rootHtmlElement = append(rootHtmlElement);
            this.dispose = () => remove(el);
        }

        this.element = rootHtmlElement;
    }
}

export {
    HtmlTree
}