const path = require("path");
const webpack = require("webpack");
const nodeExternals = require("webpack-node-externals");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    target: "node",
    node: {
        __dirname: false,
        __filename: false
    },
    context: __dirname,
    entry: "./src/index.ts",
    externals: [nodeExternals({
        whitelist: ["webpack/hot/poll?1000"]
    })],
    devtool: "inline-source-map",
    resolve: {
        // Add ".ts" and ".tsx" as a resolvable extension.
        extensions: [".ts", ".js"],
        alias: {
            "~common": path.join(__dirname, "../common/"),
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            VERSION: JSON.stringify(require("./package.json").version)
        }),
        new CopyWebpackPlugin([{
            from: "./src/config/cert/GoogleIDPCertificate-instamotion.com.pem",
            to: "cert/GoogleIDPCertificate-instamotion.com.pem"
        }])
    ],
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: "ts-loader",
                include: [/node_modules\/vehicle-data-service/]
            }, {
                test: /\.(yaml|yml)$/,
                loader: "json-loader!yaml-loader",
                include: [/node_modules\/vehicle-data-service/]
            }, {
                test: /\.(pem|txt)$/,
                loader: "raw-loader",
                exclude: /node_modules/
            },
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                exclude: /node_modules/
            },
            {
                enforce: "pre",
                test: /\.(js)$/,
                loader: "eslint-loader",
                exclude: /(node_modules)/
            },
            {
                enforce: "pre",
                test: /\.(ts)$/,
                loader: "tslint-loader",
                exclude: /(node_modules)/
            }
        ]
    },
    output: {
        filename: "index.js",
        path: path.resolve(__dirname, "../../dist-server")
    }
};
