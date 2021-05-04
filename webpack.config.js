const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: {
        framesSDK: path.join(__dirname, '/src/index.ts')
    },
    plugins: [
        new CleanWebpackPlugin()
    ],
    output: {
        globalObject: "this",
        path: path.join(__dirname, '/dist'),
        filename: '[name].js',
        library: 'FRAMES',
        libraryTarget: 'umd'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: [/node_modules/, /test/],
            }
        ]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
};