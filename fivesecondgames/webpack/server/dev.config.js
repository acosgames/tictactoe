const path = require('path');

var ENTRY_FILE = path.resolve(__dirname, '../../../game-server/index.js');
var OUTPUT_PATH = path.resolve(__dirname,'../../../builds/server');


console.log("webpack entry: " + ENTRY_FILE);
console.log("webpack output: " + ENTRY_FILE);
module.exports = {
    entry: ENTRY_FILE,
    output: {
        path: OUTPUT_PATH,
        filename: 'server.bundle.js',
    },
    devtool: "eval-source-map",
    mode: 'development',
    optimization: {
        usedExports: true,
    },
};