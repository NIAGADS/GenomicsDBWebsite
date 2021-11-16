var configure = require("../../EbrcWebsiteCommon/Site/site.webpack.config");
var path = require("path");
//const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// Create webpack alias configuration object
var alias = {
    'genomics-client': __dirname + '/webapp/wdkCustomization/js/client',
    '@components': __dirname + '/webapp/wdkCustomization/js/client/components',
    '@viz': __dirname + '/webapp/wdkCustomization/js/client/components/Visualizations',
    '@images': __dirname + '/webapp/images',
    '@sass': __dirname + '/webapp/wdkCustomization/sass'
  };

module.exports = configure({
    //plugins: [new BundleAnalyzerPlugin()],
    entry: {
        "site-client": path.join(__dirname, "/webapp/wdkCustomization/js/client/main.ts"),
    },
    resolve: {
        alias
    },
    optimization: {
        //runtimeChunk: 'single',
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test:  /[\\/]node_modules[\\/]((?!(@fontsource)).*)[\\/]/, // anything from node modules, except the fonts
                    // /[\\/]node_modules[\\/](?!lodash)(.[a-zA-Z0-9.\-_]+)[\\/]/
                    name: "vendors",
                    chunks: "all",
                    filename: "[name].bundle.js",
                },
            },
        },
    },
    stats: {
        children: false, // hide mini css plugin verbiage
    },

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
