const path = require('path');
const readline = require('readline');
const fs = require('fs');

function buildJsFileContents(lines) {
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

    var templateSplit = [];
    var modelType = [];

    var m;
    // when a template token is found (e.g. {{something}})
    while (m = match.exec(template)) {
        // add the text before the token to the output
        templateSplit.push(template.substr(0, m.index));

        // get the token
        var token = template.substr(m.index + 2, m[0].length - 4);

        // mark the position of the token
        templateSplit.push({t: token});

        // add the token to the model type
        modelType.push(token);

        // remove the processed text
        template = template.substr(m.index + m[0].length);
    }

    // add the final template text
    templateSplit.push(template);

    // create the template as a single string using js template literals
    template = templateSplit.map(t => typeof t === "string" ?
        t :
        "${model." + t.t + "}")
        .join("");

    // get distinct modl properties
    modelType = modelType.reduce((s, v) => s.indexOf(v) === -1 ? s.concat([v]) : s, []);

    return [
        // build the model
        "type Model =",
        "    {",
        `        ${modelType.map(t => `${t}: string`).join("\n        ")}`,
        "    }",
        "",
        // build a function to create a html element
        "function create (model: Model) {",
        "    var el = document.createElement('div');",
        "    el.innerHTML = `" + template + "`",
        "    var fc = <HTMLElement>el.firstChild",
        "    el.innerHTML = \"\";",
        "    return fc;",
        "}",
        "",
        "export { ",
        "    create",
        "}"
    ].join("\n");
}

/** Build a promise which will generate css -> js file contents */
function buildFile() {
    var reader = readline.createInterface({
        input: fs.createReadStream(path.resolve("./src/template.html"))
    });
    
    var lines = [];
    reader.on("line", line => lines.push(line));

    return new Promise(resolve => {
        reader.on("close", () => resolve(buildJsFileContents(lines)));
    });
}

var executed = null;
function execute() {
    if (!executed) executed = buildFile();
    return executed;
}

module.exports = execute;