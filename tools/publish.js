const fs = require("fs");
const deleteDirectory = require('./deleteDirectory');
const path = require("path");
const ncp = require("ncp").ncp;
const spawn = require('child_process').spawn;

const root = path.resolve(__dirname, "..");
const release = path.resolve(root, "release");

function copy(fileName) {
    fs.writeFileSync(path.resolve(release, fileName), fs.readFileSync(path.resolve(root, fileName)));
}

function copyDirectory(directoryName) {
    var source = path.resolve(root, directoryName);
    var dest = path.resolve(release, directoryName);

    return new Promise((resolve, reject) => {
        ncp(source, dest, err =>  err ? reject(err) : resolve());
    });
}

function publish() {
    return new Promise((resolve, reject) => {
        var prc = spawn('cmd',  ['/c', 'npm', 'publish'], {cwd: release});
        prc.stdout.setEncoding('utf8');

        prc.stdout.on('data', function (data) {
            console.log(data.toString());
        });

        var err = [];
        prc.stderr.on('data', function (data) {
            err.push(data);
        });

        prc.on('close', function (code) {
            if (!code) resolve();
            else {
                err.push(`process exit code ${code}`);
                reject(new Error(err.join("\n")));
            }
        });
    });
}

// delete old release
deleteDirectory(release);

// create new release directory
fs.mkdirSync(release);

copy("LICENSE");
copy("README.md");
copy("package.json");
copy("index.js");
copy("index.d.ts");
copyDirectory("docs")
    .then(copyDirectory("dist"))
    .then(publish)
    .catch(e => console.error(e));