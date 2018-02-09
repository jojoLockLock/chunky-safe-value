const webpack = require("webpack")
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
  entry: {
    'build': ['./src/index.ts'],
    'build.min': ['./src/index.ts']
  },
  output: {
    filename: './dist/[name].js'
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new webpack.optimize.UglifyJsPlugin({
      include: /\.min\.js$/,
      minimize: true
    })
  ],
  module: {
    rules: [{
      test: /\.ts$/,
      exclude: /node_modules/,
      use: [
        {
          loader: 'ts-loader'
        }
      ]
    }]
  },
}