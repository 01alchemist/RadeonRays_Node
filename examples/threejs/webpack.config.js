const path = require("path");
const webpack = require("webpack");
const nodeExternals = require("webpack-node-externals");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    target: "web",
    node: {
        __dirname: false,
        __filename: false
    },
    context: __dirname,
    entry: "./src/index.ts",
    externals: [nodeExternals({
        whitelist: ["webpack/hot/poll?1000", "uil", "threejs"]
    })],
    devtool: "inline-source-map",
    resolve: {
        // Add ".ts" and ".tsx" as a resolvable extension.
        extensions: [".ts", ".js"]
    },
    plugins: [
        new webpack.DefinePlugin({
            VERSION: JSON.stringify(require("./package.json").version)
        }),
        new CopyWebpackPlugin([{
            from: "./src/models",
            to: "models"
        }]),
        new HtmlWebpackPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.(obj|txt|mtl)$/,
                loader: "raw-loader",
                exclude: /node_modules/
            },
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                exclude: /node_modules/
            }
        ]
    },
    output: {
        filename: "index.js",
        path: path.resolve(__dirname, "./dist")
    }
};
