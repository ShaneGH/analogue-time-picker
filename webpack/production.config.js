const merge = require("webpack-merge");
const base = require("./base.config");

module.exports = merge(base, {
    entry: {
        "./dist/material-time-lite.min": "./timePicker.ts"
    }
});