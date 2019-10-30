var configure = require('../../EbrcWebsiteCommon/Site/site.webpack.config');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports = configure({
    entry: {
        'site-legacy': ['./webapp/wdkCustomization/js/client/main.ts',
            require.resolve('../../EbrcWebsiteCommon/Site/webapp/wdkCustomization/js/common.js')
        ],
        'site-client': './webapp/wdkCustomization/js/client/main.ts'
    },
    module: {
        rules: [{
            test: /\.less$/,
            loader: ExtractTextPlugin.extract(
                ['css-loader', {
                    loader: 'postcss-loader',
                    options: {
                        plugins: () => autoprefixer({
                            browsers: ['last 3 versions', '> 1%']
                        })
                    }
                }])
        }, {
            test: /\.tsx?$/,
            exclude: /node_modules/,
            use: [{
                loader: 'babel-loader',
            }, {
                loader: 'ts-loader',
                options: {
                    reportFiles: ['./webapp/**/*.{ts,tsx}']
                }
            }],
        }, 
        {
                test: require.resolve('./webapp/wdkCustomization/js/lib/locusZoom/locuszoom.app.js'),
                use: [{
                    loader: 'expose-loader',
                    options: 'lz'
                }]
            }

        ]
    },
    devtool: 'inline-source-map',
    plugins: [
        new ExtractTextPlugin({
            filename: '[name].css',
            allChunks: true
        })
    ]
});