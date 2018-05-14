const fs = require("fs");
const path = require("path");
const walk = require('fs-walker');

var testBin = path.resolve(__dirname, "../testBin");

(function(){
    if (!fs.existsSync(testBin)) return;
    
    // delete all files
    var files = walk.sync(
        testBin)
        .forEach(stats => fs.unlinkSync(stats.fullname));

    // order all directories
    var dirs = [];
    walk.directories.sync(
        testBin)
        .forEach(stats => dirs.splice(0, 0, stats.fullname));

    // delete all directories
    dirs.forEach(d => fs.rmdirSync(d));

    // order root directory
    fs.rmdirSync(testBin);
}());