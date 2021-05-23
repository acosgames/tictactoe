const path = require('path');

var ENTRY_FILE = './game-server/index.js';
var OUTPUT_PATH = '../../builds/server';

module.exports = {
    entry: { main: ENTRY_FILE },
    output: {
        path: path.resolve(__dirname, OUTPUT_PATH),
        filename: 'server.bundle.js',
    },
    devtool: false,
    mode: 'production',
    optimization: {
        usedExports: true,
    },
};