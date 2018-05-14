const path = require('path');

module.exports = {
    // "entry" in child config.js files
    
    output: {
        path: path.resolve("./"),
        libraryTarget: "umd"
    },

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".json"]
    },

    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            { 
                test: /\.tsx?$/, 
                loader: "awesome-typescript-loader",
                query: {
                    configFileName: "./tsconfig.json"
                }
            }
        ]
    }
};