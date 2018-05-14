const fs = require("fs");
const path = require("path");
const walk = require('fs-walker');

function mochaUrl (mochaFile) {
    return path.resolve(__dirname, "../node_modules/mocha/", mochaFile);
}

var files = [];    
var unitTests = path.resolve(__dirname, "../testBin/unitTests");
if (fs.existsSync(unitTests)) {
  files = files.concat(
    walk.sync(
      unitTests, 
      stats => !/\.js$/.test(stats.name)));
}

files = files.map(x => x.fullname.replace(/\\/g, "/").replace(/^.+?testBin\//i, "./"))

var page = `<html>
  <head>
    <title>Tests</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="${mochaUrl("mocha.css")}" />
  </head>
  <body>
    <script src="${path.resolve(__dirname, "../node_modules/requirejs/require.js")}"></script>
    <script src="${mochaUrl("mocha.js")}"></script>

    <div id="mocha"></div>
    
    <script>
      mocha.setup("bdd");

      require([
        ${files.map(x => `"${x}"`).join(",\n        ")}], function() {

          mocha.run();
        });
    </script>
  </body>
</html>`;


fs.writeFileSync(path.resolve(__dirname, "../testBin/unitTest.html"), page);