var webpack = require("webpack");

module.exports = {
    entry: "./entry.js",
    output: {
        path: "dist/",
        filename: "sjh.js"
    },
    plugins: [new webpack.optimize.UglifyJsPlugin()]
};