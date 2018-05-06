const merge = require("webpack-merge");
const base = require("./base.config");

module.exports = merge(base, {
    entry: {
        "simple-material-time.min": "./index.ts"
    }
});