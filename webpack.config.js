var webpack = require('webpack');
var path = require('path');

var entryFile = path.join(__dirname, './src/SurfacePlot.js');
var srcPath = path.join(__dirname, './src');
var outPath = path.join(__dirname, './bin');
module.exports = [
    {
        entry: entryFile,
        output: {
            path: outPath,
            filename: 'surfaceplot.js'
        },
        module: {
            loaders: [{
                test: [srcPath],
                exclude: /(node_modules)/,
                loader: 'babel-loader'
            }]
        }
    },
    {
        entry: entryFile,
        output: {
            path: outPath,
            filename: 'surfaceplot.min.js'
        },
        module: {
            loaders: [{
                test: [srcPath],
                exclude: /(node_modules)/,
                loader: 'babel-loader'
            }]
        },
        plugins: [
           new webpack.optimize.UglifyJsPlugin()
        ]
    }
];
