const merge = require("webpack-merge");
const base = require("./base.config");

module.exports = merge(base, {
    entry: {
        "./dist/analogue-time-picker": "./index.ts"
    },

    optimization: {
        minimize: false
    }
});