const path = require('path');
const readline = require('readline');
const fs = require('fs');

var reader = readline.createInterface({
    input: fs.createReadStream(path.resolve("./src/template.html"))
});

var lines = [];
reader.on("line", line => {
    lines.push(line);
});

function jsFile() {
    var match = /\{\{.+?\}\}/;
    var template = lines
        .map(l => l
            // remove \s from beginning of line
            .replace(/^\s*/g, "")
            // convert \ to \\
            .replace(/\\/g, "\\\\")
            // convert ` to \`
            .replace(/`/g, "\\`"))
        .join("")
        // remove comments
        .replace(/<!--.+?-->/g, "");

    var templateSplit = [""];
    var typ = [];

    var m;
    while (m = match.exec(template)) {
        templateSplit[templateSplit.length - 1] += template.substr(0, m.index);
        var token = template.substr(m.index + 2, m[0].length - 4);

        templateSplit.push({t: token});
        typ.push(token);

        templateSplit.push("");
        template = template.substr(m.index + m[0].length);
    }

    templateSplit[templateSplit.length - 1] += template;

    template = templateSplit.map(t => typeof t === "string" ?
        t :
        "${model." + t.t + "}")
        .join("");

    typ = typ.reduce((s, v) => s.indexOf(v) === -1 ? s.concat([v]) : s, []);

    return [
        "// This is an auto-generated file, built with ./tools/buildHtmlTemplate.js",
        "",
        "type Model =",
        "    {",
        `        ${typ.map(t => `${t}: string`).join("\n        ")}`,
        "    }",
        "",
        "function create (model: Model) {",
        "    var el = document.createElement('div');",
        "    el.innerHTML = `" + template + "`",
        "    var fc = <HTMLElement>el.firstChild",
        "    el.innerHTML = \"\";",
        "    return fc;",
        "}",
        "",
        "function append(el: HTMLElement, model: Model) {",
        "    var n = create(model);",

        "    el.innerHTML = n.innerHTML;",
        "    n.innerHTML = \"\";",
        "    for (var i = 0; i < n.attributes.length; i++) {",  
        "        if (n.attributes[i].name !== \"class\") el.setAttribute(n.attributes[i].name, n.attributes[i].value);", 
        "    }", 
        "", 
        "    for (var i = 0; i < n.classList.length; i++) {",  
        "        el.classList.add(n.classList[i]);", 
        "    }",
        "", 
        "    el.classList.add(\"smt\");", 
        "    el.classList.add(\"mtl-background-color\");",
        " ",
        "    return el;",
        "}",
        "",
        "function remove(el: HTMLElement) {",
        "    el.innerHTML = \"\";",
        "    el.classList.remove(\"smt\");", 
        "    el.classList.remove(\"mtl-background-color\");",
        " ",
        "    return el;",
        "}",
        "",
        "export { ",
        "    append,",
        "    create,",
        "    remove",
        "}"
    ].join("\n");
}

reader.on("close", () => fs.writeFileSync(path.resolve("./src/template.ts"), jsFile()));