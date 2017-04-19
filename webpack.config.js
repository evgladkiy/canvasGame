const webpack = require('webpack');

module.exports = {
    entry: './js/index.js',
    output: {
        filename: 'build.js'
    },
    watch: true,
    devtool: 'source-map',
    module: {
        loaders: [
          {
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel-loader?presets[]=env'
          }
        ]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
    ]
}
