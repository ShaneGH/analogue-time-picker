// This is an auto-generated file, built with ./tools/buildHtmlTemplate.js

type Model =
    {
        title: string
        hour: string
        minute: string
        am: string
        pm: string
    }

var template = [
    "<div class=\"mtl mtl-background-color\" role=\"form\" aria-describedby=\"",
    (model: Model) => model ? model.title : "",
    "\"><label style=\"display: none\" id=\"",
    (model: Model) => model ? model.title : "",
    "\">Enter time</label><div class=\"mtl-time mdl-color--primary\"><label style=\"display: none\" for=\"",
    (model: Model) => model ? model.hour : "",
    "\" class=\"mtl-hour-label\">Hours</label><input type=\"text\" class=\"mtl-hour\" id=\"",
    (model: Model) => model ? model.hour : "",
    "\" />:<label style=\"display: none\" for=\"",
    (model: Model) => model ? model.minute : "",
    "\" class=\"mtl-minute-label\">Minutes</label><input type=\"text\" class=\"mtl-minute\" id=\"",
    (model: Model) => model ? model.minute : "",
    "\" /><div class=\"mtl-ampm\"><label style=\"display: none\" for=\"",
    (model: Model) => model ? model.am : "",
    "\">Change to AM</label><button class=\"mtl-am\" id=\"",
    (model: Model) => model ? model.am : "",
    "\">am</button><label style=\"display: none\" for=\"",
    (model: Model) => model ? model.pm : "",
    "\">Change to PM</label><button class=\"mtl-pm\" id=\"",
    (model: Model) => model ? model.pm : "",
    "\">pm</button></div></div><div class=\"mtl-clock-cnt\"><div class=\"mtl-clock\" aria-hidden=\"true\"><div class=\"mtl-face mtl-face-color\"></div><div class=\"mtl-h-cnt-cnt\"><div class=\"mtl-h-cnt\"><div class=\"mtl-b-pos\"></div><div class=\"mtl-b mdl-color--primary\"></div></div></div><div class=\"mtl-ns mtl-hours mtl-number-color\"><div class=\"mtl-n-box\"><div class=\"mtl-n-cnt mtl-n-cnt-0\"><div class=\"mtl-n mtl-n-0\">12</div><div class=\"mtl-n-pad\"></div><div class=\"mtl-n mtl-n-0\">00</div></div></div><div class=\"mtl-n-box\"><div class=\"mtl-n-cnt mtl-n-cnt-1\"><div class=\"mtl-n mtl-n-1\">01</div><div class=\"mtl-n-pad\"></div><div class=\"mtl-n mtl-n-1\">13</div></div></div><div class=\"mtl-n-box\"><div class=\"mtl-n-cnt mtl-n-cnt-2\"><div class=\"mtl-n mtl-n-2\">02</div><div class=\"mtl-n-pad\"></div><div class=\"mtl-n mtl-n-2\">14</div></div></div><div class=\"mtl-n-box\"><div class=\"mtl-n-cnt mtl-n-cnt-3\"><div class=\"mtl-n mtl-n-3\">03</div><div class=\"mtl-n-pad\"></div><div class=\"mtl-n mtl-n-3\">15</div></div></div><div class=\"mtl-n-box\"><div class=\"mtl-n-cnt mtl-n-cnt-4\"><div class=\"mtl-n mtl-n-4\">04</div><div class=\"mtl-n-pad\"></div><div class=\"mtl-n mtl-n-4\">16</div></div></div><div class=\"mtl-n-box\"><div class=\"mtl-n-cnt mtl-n-cnt-5\"><div class=\"mtl-n mtl-n-5\">05</div><div class=\"mtl-n-pad\"></div><div class=\"mtl-n mtl-n-5\">17</div></div></div><div class=\"mtl-n-box\"><div class=\"mtl-n-cnt mtl-n-cnt-6\"><div class=\"mtl-n mtl-n-6\">06</div><div class=\"mtl-n-pad\"></div><div class=\"mtl-n mtl-n-6\">18</div></div></div><div class=\"mtl-n-box\"><div class=\"mtl-n-cnt mtl-n-cnt-7\"><div class=\"mtl-n mtl-n-7\">07</div><div class=\"mtl-n-pad\"></div><div class=\"mtl-n mtl-n-7\">19</div></div></div><div class=\"mtl-n-box\"><div class=\"mtl-n-cnt mtl-n-cnt-8\"><div class=\"mtl-n mtl-n-8\">08</div><div class=\"mtl-n-pad\"></div><div class=\"mtl-n mtl-n-8\">20</div></div></div><div class=\"mtl-n-box\"><div class=\"mtl-n-cnt mtl-n-cnt-9\"><div class=\"mtl-n mtl-n-9\">09</div><div class=\"mtl-n-pad\"></div><div class=\"mtl-n mtl-n-9\">21</div></div></div><div class=\"mtl-n-box\"><div class=\"mtl-n-cnt mtl-n-cnt-10\"><div class=\"mtl-n mtl-n-10\">10</div><div class=\"mtl-n-pad\"></div><div class=\"mtl-n mtl-n-10\">22</div></div></div><div class=\"mtl-n-box\"><div class=\"mtl-n-cnt mtl-n-cnt-11\"><div class=\"mtl-n mtl-n-11\">11</div><div class=\"mtl-n-pad\"></div><div class=\"mtl-n mtl-n-11\">23</div></div></div></div><div class=\"mtl-ns mtl-minutes mtl-number-color\"><div class=\"mtl-n-cnt mtl-n-cnt-0\"><div class=\"mtl-n mtl-n-0\">00</div></div><div class=\"mtl-n-box\"><div class=\"mtl-n-cnt mtl-n-cnt-1\"><div class=\"mtl-n mtl-n-1\">05</div></div></div><div class=\"mtl-n-box\"><div class=\"mtl-n-cnt mtl-n-cnt-2\"><div class=\"mtl-n mtl-n-2\">10</div></div></div><div class=\"mtl-n-box\"><div class=\"mtl-n-cnt mtl-n-cnt-3\"><div class=\"mtl-n mtl-n-3\">15</div></div></div><div class=\"mtl-n-box\"><div class=\"mtl-n-cnt mtl-n-cnt-4\"><div class=\"mtl-n mtl-n-4\">20</div></div></div><div class=\"mtl-n-box\"><div class=\"mtl-n-cnt mtl-n-cnt-5\"><div class=\"mtl-n mtl-n-5\">25</div></div></div><div class=\"mtl-n-box\"><div class=\"mtl-n-cnt mtl-n-cnt-6\"><div class=\"mtl-n mtl-n-6\">30</div></div></div><div class=\"mtl-n-box\"><div class=\"mtl-n-cnt mtl-n-cnt-7\"><div class=\"mtl-n mtl-n-7\">35</div></div></div><div class=\"mtl-n-box\"><div class=\"mtl-n-cnt mtl-n-cnt-8\"><div class=\"mtl-n mtl-n-8\">40</div></div></div><div class=\"mtl-n-box\"><div class=\"mtl-n-cnt mtl-n-cnt-9\"><div class=\"mtl-n mtl-n-9\">45</div></div></div><div class=\"mtl-n-box\"><div class=\"mtl-n-cnt mtl-n-cnt-10\"><div class=\"mtl-n mtl-n-10\">50</div></div></div><div class=\"mtl-n-box\"><div class=\"mtl-n-cnt mtl-n-cnt-11\"><div class=\"mtl-n mtl-n-11\">55</div></div></div></div><div class=\"mtl-h-cnt-cnt\"><div class=\"mtl-h-cnt\"><div class=\"mtl-b-pos\"></div><div class=\"mtl-b-spacer\"></div><div class=\"mtl-h mdl-color--primary\"></div></div></div><div class=\"mtl-h-cnt-cnt mtl-h-cnt-cnt-dot\"><div class=\"mtl-h-dot mdl-color--primary\"></div></div></div><div class=\"mtl-clock-btn\"><button class=\"mtl-ok mdl-button mdl-js-button mdl-button--primary mtl-enforce-font-size\">ok</button><button class=\"mtl-cancel mdl-button mdl-js-button mdl-button--primary mtl-enforce-font-size\">cancel</button></div></div></div>"
];

function create (model: Model) {
    var el = document.createElement('div');
    el.innerHTML = template.map(t => typeof t === "string" ? t : t(model)).join("");
    var fc = <HTMLElement>el.firstChild
    el.innerHTML = "";
    return fc;
}

function append(el: HTMLElement, model: Model) {
    var n = create(model);
    el.innerHTML = n.innerHTML;
    n.innerHTML = "";
    for (var i = 0; i < n.attributes.length; i++) {
        if (n.attributes[i].name !== "class") el.setAttribute(n.attributes[i].name, n.attributes[i].value);
    }

    for (var i = 0; i < n.classList.length; i++) {
        el.classList.add(n.classList[i]);
    }

    el.classList.add("smt");
    el.classList.add("mtl-background-color");
 
    return el;
}

function remove(el: HTMLElement) {
    el.innerHTML = "";
    el.classList.remove("smt");
    el.classList.remove("mtl-background-color");
 
    return el;
}

export { 
    append,
    create,
    remove
}