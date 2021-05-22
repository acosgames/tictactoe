const webpack = require('webpack');
const path = require('path');

var ENTRY_FILE = './game-client/index.js';
var OUTPUT_PATH = '../../../builds/client';

module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
    entry: { main: ENTRY_FILE },
    output: {
        path: path.resolve(__dirname, OUTPUT_PATH),
        filename: 'client.bundle.js',
    },
    //node: { console: false, fs: 'empty', net: 'empty', tls: 'empty' },
    module: {
        rules: [
            {
                test: /\.(css|scss)$/i,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.(png|jpg|gif|svg)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                        },
                    },
                ],
            },
            {
                test: /\.(js|jsx|mjs)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        "presets": [
                            ["@babel/preset-env", {
                                "useBuiltIns": "usage",
                                "corejs": 3, // or 2,
                                "targets": {
                                    "firefox": "64", // or whatever target to choose .    
                                },
                            }],
                            "@babel/preset-react"
                        ],
                        "plugins": [
                            "@babel/plugin-proposal-object-rest-spread",

                        ]
                    }
                }
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            "React": "react",
        }),
        // new CompressPlugin(),
        new webpack.optimize.LimitChunkCountPlugin({
            maxChunks: 1,
        }),

    ]
};
