const path = require('path');
const webpack = require('webpack');

module.exports = {
    devtool: 'source-map',
    entry: './ts/dmn_projet.ts',
    mode: 'development', // Source maps are enabled automatically (https://blog.jakoblind.no/debug-webpack-app-browser/)...
    module: {
        rules: [
            {
                test: /\.css$/i, use: ["style-loader", "css-loader"]
            },
            {
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ],
    },
    optimization: {
        minimize: true // This is default in 'production' mode...
    },
    output: {
        clean: true,
        filename: 'dmn_projet.js',
        path: path.resolve(__dirname, 'js'),
    },
    resolve: {
        fallback: {
            "fs": false,
            "util": require.resolve("util/"),
            "process": "process/browser"
        },
        extensions: [".ts", ".js"]

    },
    plugins: [
        new webpack.ProvidePlugin({
            process: 'process/browser',
        }),
    ],
};
