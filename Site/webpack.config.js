var configure = require("../../EbrcWebsiteCommon/Site/site.webpack.config");
var path = require("path");
//const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = configure({
    //plugins: [new BundleAnalyzerPlugin()],
    entry: {
        "site-client": path.join(__dirname, "/webapp/wdkCustomization/js/client/main.ts"),
    },
    stats: {
        children: false, // hide mini css plugin verbiage
    },
    devtool: "inline-source-map",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                    //path.join(__dirname, "/webapp/wdkCustomization/js/client/components/RecordPage/RecordTable-old"),
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            configFile: path.join(process.cwd(), ".babelrc"),
                        },
                    },
                    {
                        loader: "ts-loader",
                        options: {
                            reportFiles: ["./webapp/**/*.{ts,tsx}"],
                        },
                    },
                ],
            },
        ],
    },
});
