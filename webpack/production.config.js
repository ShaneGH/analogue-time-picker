const merge = require("webpack-merge");
const base = require("./base.config");

module.exports = merge(base, {
    entry: {
        "material-time-lite.min": "./index.ts"
    }
});