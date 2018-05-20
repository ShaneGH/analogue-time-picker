const fs = require("fs");
const walk = require('fs-walker');

function deleteDirectory (directory) {
    if (!fs.existsSync(directory)) return;
    
    // delete all files
    var files = walk.sync(
        directory)
        .forEach(stats => fs.unlinkSync(stats.fullname));

    // order all directories
    var dirs = [];
    walk.directories.sync(
        directory)
        .forEach(stats => dirs.splice(0, 0, stats.fullname));

    // delete all directories
    dirs.forEach(d => fs.rmdirSync(d));

    // order root directory
    fs.rmdirSync(directory);
}

module.exports = deleteDirectory;