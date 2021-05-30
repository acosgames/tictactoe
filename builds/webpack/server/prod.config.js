const webpack = require('webpack');
const path = require('path');

var ENTRY_FILE = path.resolve(__dirname, '../../../game-server/index.js');
var OUTPUT_PATH = path.resolve(__dirname, '../../../builds/server');


console.log("webpack entry: " + ENTRY_FILE);
console.log("webpack output: " + ENTRY_FILE);

module.exports = {
    entry: ENTRY_FILE,
    output: {
        path: OUTPUT_PATH,
        filename: 'server.bundle.js',
    },
    devtool: false,
    mode: 'production',
    optimization: {
        usedExports: true,
    },
    plugins: [
        new webpack.SourceMapDevToolPlugin({
            filename: '[file].map',
            append: `\n//# sourceMappingURL=${OUTPUT_PATH}[url]`,
            fileContext: 'public'
        })

    ]
};