const generateCssFile = require('./generateCssFile');
const fs = require("fs");
const path = require("path");

generateCssFile()
    .then(js => new Promise((resolve, reject) => {
        fs.writeFile(
            path.resolve(__dirname, "../src/css.ts"),
            js,
            err => err ? reject(err) : resolve());
    }))
    .then(() => console.log("Css file Complete"))
    .catch(err => console.error(err));