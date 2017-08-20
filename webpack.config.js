const path = require("path")
const webpack = require("webpack")
const nodeExternals = require("webpack-node-externals")
const CopyWebpackPlugin = require("copy-webpack-plugin")

module.exports = {
    target: "node",
    node: {
        __dirname: false,
        __filename: false,
    },
    context: __dirname,
    entry: "./src/index.ts",
    externals: [
        nodeExternals({
            whitelist: ["webpack/hot/poll?1000"],
        }),
    ],
    devtool: "inline-source-map",
    resolve: {
        // Add ".ts" and ".tsx" as a resolvable extension.
        extensions: [".ts", ".js"],
    },
    plugins: [
        new webpack.DefinePlugin({
            VERSION: JSON.stringify(require("./package.json").version),
        }),
    ],
    module: {
        rules: [
            {
                test: /\.node$/,
                use: "node-loader",
            },
            {
                test: /\.(pem|txt)$/,
                loader: "raw-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                exclude: /node_modules/,
            },
            {
                enforce: "pre",
                test: /\.(ts)$/,
                loader: "tslint-loader",
                exclude: /(node_modules)/,
            },
        ],
    },
    output: {
        filename: "index.js",
        path: path.resolve(__dirname, "dist"),
        library: "radeonrays",
        libraryTarget: "umd",
    },
}
