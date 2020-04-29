const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const htmlWebpackPlugin = new HtmlWebpackPlugin({
    template: path.resolve('public/index.html'),
    //favicon: path.resolve('public/favicon.ico')
});

module.exports = {
    entry: path.resolve('src/index.js'),
    resolve: {
        modules: ['src', 'node_modules'],
        alias: {
            '@': path.resolve('src')
        }
        //extensions: ['.js']
    },
    output: {
        filename: '[name].js',
        path: path.resolve('public/dist'),
        publicPath: '/',
    },
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.(scss|sass|css)$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    'style-loader',
                    // Translates CSS into CommonJS
                    'css-loader',
                    // Compiles Sass to CSS
                    'sass-loader',
                ],
            },
            {
                test: /\.(svg|eot|woff|woff2|ttf)$/,
                use: ['file-loader']
            }
        ]
    },
    devServer: {
        publicPath: "/",
        contentBase: "./public",
        hot: true,
        historyApiFallback: true
    },
    plugins: [
        htmlWebpackPlugin
    ]
};