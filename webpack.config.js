var fs = require('fs');
var webpack = require('webpack');
var path = require('path');

var entryFile = path.join(__dirname, '/browser/src/index.js');
var srcPath = path.join(__dirname, '/browser/src');
var outPath = path.join(__dirname, '/browser/bin');
module.exports = [
    {
        entry: entryFile,
        output: {
            path: outPath,
            filename: 'pagination.js'
        },
        module: {
            loaders: [{
                test: [srcPath],
                exclude: /(node_modules)/,
                loader: 'babel-loader'
            }]
        },
        //plugins: [
        //    new webpack.optimize.UglifyJsPlugin(),
        //]
    },
];
