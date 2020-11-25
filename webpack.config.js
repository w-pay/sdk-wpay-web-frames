const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: {
        elementsSDK: path.join(__dirname, '/src/customer/index.ts')
    },
    plugins: [
        new CleanWebpackPlugin()
    ],
    output: {
        globalObject: "this",
        path: path.join(__dirname, '/dist'),
        filename: '[name].js',
        library: 'ELEMENTS',
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