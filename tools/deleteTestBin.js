const deleteDirectory = require('./deleteDirectory');
const path = require("path");

deleteDirectory(path.resolve(__dirname, "../testBin"));