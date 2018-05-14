const path = require('path');
const readline = require('readline');
const fs = require('fs');

var reader = readline.createInterface({
    input: fs.createReadStream(path.resolve("./src/clock.css"))
});

var lines = [];
reader.on("line", line => lines.push(line));

function jsFile() {
    var ls = lines
        .map(l => l
            .replace(/^\s*/g, "")
            .replace(/\\/g, "\\\\")
            .replace(/"/g, "\\\"")
            .replace(/\s*\{\s*/g, "{")
            .replace(/\s*:\s*/g, ":"))
        .join("")
        .replace(/\/\*.+?\*\//g, "");

    // remove comments
    ls = ls.replace(/\/\*.+?\*\//g, "");

    return [
        "// This is an auto-generated file, built with ./tools/buildCss.js",
        "",
        `var css = "${ls}";`,
        "var enabled = false;",
        "",
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

reader.on("close", () => fs.writeFileSync(path.resolve("./src/css.ts"), jsFile()));