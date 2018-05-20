const fs = require("fs");
const deleteDirectory = require('./deleteDirectory');
const path = require("path");
const ncp = require("ncp").ncp;
const spawn = require('child_process').spawn;

function copy(fileName) {
    fs.writeFileSync(path.resolve(__dirname, "../release", fileName), fs.readFileSync(path.resolve(__dirname, "..", fileName)));
}

function copyDirectory(directoryName) {
    var source = path.resolve(__dirname, "..", directoryName);
    var dest = path.resolve(__dirname, "../release", directoryName);

    return new Promise((resolve, reject) => {
        ncp(source, dest, err =>  err ? reject(err) : resolve());
    });
}

function publish() {
    return new Promise((resolve, reject) => {
        var prc = spawn('npm',  ['publish']);
        prc.stdout.setEncoding('utf8');
        
        prc.stdout.on('data', function (data) {
            console.log(data.toString());
        });

        prc.on('close', function (code) {
            if (!code) resolve();
            else reject(new Error('process exit code ' + code));
        });
    });
}

// delete old release
deleteDirectory(path.resolve(__dirname, "../release"));

// create new release directory
fs.mkdirSync(path.resolve(__dirname, "../release"));

copy("LICENSE");
copy("README.md");
copy("package.json");
copy("index.js");
copy("index.d.ts");
copyDirectory("docs")
    .then(copyDirectory("dist"))
    .then(publish)
    .catch(e => console.error(e));