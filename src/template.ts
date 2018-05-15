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
    "<div class=\"smt smt-background-color\" role=\"form\" aria-describedby=\"",
    (model: Model) => model ? model.title : "",
    "\"><label style=\"display: none\" id=\"",
    (model: Model) => model ? model.title : "",
    "\">Enter time</label><div class=\"smt-time mdl-color--primary\"><label style=\"display: none\" for=\"",
    (model: Model) => model ? model.hour : "",
    "\" class=\"smt-hour-label\">Hours</label><input type=\"text\" class=\"smt-hour\" id=\"",
    (model: Model) => model ? model.hour : "",
    "\" />:<label style=\"display: none\" for=\"",
    (model: Model) => model ? model.minute : "",
    "\" class=\"smt-minute-label\">Minutes</label><input type=\"text\" class=\"smt-minute\" id=\"",
    (model: Model) => model ? model.minute : "",
    "\" /><div class=\"smt-ampm\"><label style=\"display: none\" for=\"",
    (model: Model) => model ? model.am : "",
    "\">Change to AM</label><button class=\"smt-am\" id=\"",
    (model: Model) => model ? model.am : "",
    "\">am</button><label style=\"display: none\" for=\"",
    (model: Model) => model ? model.pm : "",
    "\">Change to PM</label><button class=\"smt-pm\" id=\"",
    (model: Model) => model ? model.pm : "",
    "\">pm</button></div></div><div class=\"smt-clock-cnt\"><div class=\"smt-clock\" aria-hidden=\"true\"><div class=\"smt-face smt-face-color\"></div><div class=\"smt-h-cnt-cnt\"><div class=\"smt-h-cnt\"><div class=\"smt-b-pos\"></div><div class=\"smt-b mdl-color--primary\"></div></div></div><div class=\"smt-ns smt-hours smt-number-color\"><div class=\"smt-n-box\"><div class=\"smt-n-cnt smt-n-cnt-0\"><div class=\"smt-n smt-n-0\">12</div><div class=\"smt-n-pad\"></div><div class=\"smt-n smt-n-0\">00</div></div></div><div class=\"smt-n-box\"><div class=\"smt-n-cnt smt-n-cnt-1\"><div class=\"smt-n smt-n-1\">01</div><div class=\"smt-n-pad\"></div><div class=\"smt-n smt-n-1\">13</div></div></div><div class=\"smt-n-box\"><div class=\"smt-n-cnt smt-n-cnt-2\"><div class=\"smt-n smt-n-2\">02</div><div class=\"smt-n-pad\"></div><div class=\"smt-n smt-n-2\">14</div></div></div><div class=\"smt-n-box\"><div class=\"smt-n-cnt smt-n-cnt-3\"><div class=\"smt-n smt-n-3\">03</div><div class=\"smt-n-pad\"></div><div class=\"smt-n smt-n-3\">15</div></div></div><div class=\"smt-n-box\"><div class=\"smt-n-cnt smt-n-cnt-4\"><div class=\"smt-n smt-n-4\">04</div><div class=\"smt-n-pad\"></div><div class=\"smt-n smt-n-4\">16</div></div></div><div class=\"smt-n-box\"><div class=\"smt-n-cnt smt-n-cnt-5\"><div class=\"smt-n smt-n-5\">05</div><div class=\"smt-n-pad\"></div><div class=\"smt-n smt-n-5\">17</div></div></div><div class=\"smt-n-box\"><div class=\"smt-n-cnt smt-n-cnt-6\"><div class=\"smt-n smt-n-6\">06</div><div class=\"smt-n-pad\"></div><div class=\"smt-n smt-n-6\">18</div></div></div><div class=\"smt-n-box\"><div class=\"smt-n-cnt smt-n-cnt-7\"><div class=\"smt-n smt-n-7\">07</div><div class=\"smt-n-pad\"></div><div class=\"smt-n smt-n-7\">19</div></div></div><div class=\"smt-n-box\"><div class=\"smt-n-cnt smt-n-cnt-8\"><div class=\"smt-n smt-n-8\">08</div><div class=\"smt-n-pad\"></div><div class=\"smt-n smt-n-8\">20</div></div></div><div class=\"smt-n-box\"><div class=\"smt-n-cnt smt-n-cnt-9\"><div class=\"smt-n smt-n-9\">09</div><div class=\"smt-n-pad\"></div><div class=\"smt-n smt-n-9\">21</div></div></div><div class=\"smt-n-box\"><div class=\"smt-n-cnt smt-n-cnt-10\"><div class=\"smt-n smt-n-10\">10</div><div class=\"smt-n-pad\"></div><div class=\"smt-n smt-n-10\">22</div></div></div><div class=\"smt-n-box\"><div class=\"smt-n-cnt smt-n-cnt-11\"><div class=\"smt-n smt-n-11\">11</div><div class=\"smt-n-pad\"></div><div class=\"smt-n smt-n-11\">23</div></div></div></div><div class=\"smt-ns smt-minutes smt-number-color\"><div class=\"smt-n-cnt smt-n-cnt-0\"><div class=\"smt-n smt-n-0\">00</div></div><div class=\"smt-n-box\"><div class=\"smt-n-cnt smt-n-cnt-1\"><div class=\"smt-n smt-n-1\">05</div></div></div><div class=\"smt-n-box\"><div class=\"smt-n-cnt smt-n-cnt-2\"><div class=\"smt-n smt-n-2\">10</div></div></div><div class=\"smt-n-box\"><div class=\"smt-n-cnt smt-n-cnt-3\"><div class=\"smt-n smt-n-3\">15</div></div></div><div class=\"smt-n-box\"><div class=\"smt-n-cnt smt-n-cnt-4\"><div class=\"smt-n smt-n-4\">20</div></div></div><div class=\"smt-n-box\"><div class=\"smt-n-cnt smt-n-cnt-5\"><div class=\"smt-n smt-n-5\">25</div></div></div><div class=\"smt-n-box\"><div class=\"smt-n-cnt smt-n-cnt-6\"><div class=\"smt-n smt-n-6\">30</div></div></div><div class=\"smt-n-box\"><div class=\"smt-n-cnt smt-n-cnt-7\"><div class=\"smt-n smt-n-7\">35</div></div></div><div class=\"smt-n-box\"><div class=\"smt-n-cnt smt-n-cnt-8\"><div class=\"smt-n smt-n-8\">40</div></div></div><div class=\"smt-n-box\"><div class=\"smt-n-cnt smt-n-cnt-9\"><div class=\"smt-n smt-n-9\">45</div></div></div><div class=\"smt-n-box\"><div class=\"smt-n-cnt smt-n-cnt-10\"><div class=\"smt-n smt-n-10\">50</div></div></div><div class=\"smt-n-box\"><div class=\"smt-n-cnt smt-n-cnt-11\"><div class=\"smt-n smt-n-11\">55</div></div></div></div><div class=\"smt-h-cnt-cnt\"><div class=\"smt-h-cnt\"><div class=\"smt-b-pos\"></div><div class=\"smt-b-spacer\"></div><div class=\"smt-h mdl-color--primary\"></div></div></div><div class=\"smt-h-cnt-cnt smt-h-cnt-cnt-dot\"><div class=\"smt-h-dot mdl-color--primary\"></div></div></div><div class=\"smt-clock-btn\"><button class=\"smt-ok mdl-button mdl-js-button mdl-button--primary smt-enforce-font-size\">ok</button><button class=\"smt-cancel mdl-button mdl-js-button mdl-button--primary smt-enforce-font-size\">cancel</button></div></div></div>"
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
    el.classList.add("smt-background-color");
 
    return el;
}

function remove(el: HTMLElement) {
    el.innerHTML = "";
    el.classList.remove("smt");
    el.classList.remove("smt-background-color");
 
    return el;
}

export { 
    append,
    create,
    remove
}