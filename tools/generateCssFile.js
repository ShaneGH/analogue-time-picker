const path = require('path');
const readline = require('readline');
const fs = require('fs');

/** Create the js content of the file to add css */
function buildJsFileContent(lines) {
    var ls = lines
        .map(l => l
            // remove space at beginning of line
            .replace(/^\s*/g, "")
            // remove space at end of line
            .replace(/\s*$/g, "")
            // convert \ to \\
            .replace(/\\/g, "\\\\")
            // convert " to \"
            .replace(/"/g, "\\\"")
            // convert " { " to "{"
            .replace(/\s*\{\s*/g, "{")
            // convert " : " to ":"
            .replace(/\s*:\s*/g, ":"))
        .join("")
        // remove comments
        .replace(/\/\*.+?\*\//g, "");

    return [
        // add css string
        `var css = "${ls}";`,
        "var enabled = false;",
        "",
        // add function which injects css into page
        "function enable () {",
        "\tif (enabled) return;",
        "\tenabled = true;",
        "",
        "\tvar el = document.createElement('style');",
        "\tel.innerHTML = css;",
        "\t(document.head || document.body).appendChild(el);",
        "}",
        "",
        "export {",
        "\tenable",
        "}"
    ].join("\n");
}

/** Build a promise which will generate css -> js file contents */
function buildFile() {
    var reader = readline.createInterface({
        input: fs.createReadStream(path.resolve("./src/assets/style.css"))
    });
    
    var lines = [];
    reader.on("line", line => lines.push(line));

    return new Promise(resolve => {
        reader.on("close", () => resolve(buildJsFileContent(lines)));
    });
}

var executed = null;
function execute () {
    if (!executed) {
        executed = buildFile();
    }
    
    return executed;
}

module.exports = execute