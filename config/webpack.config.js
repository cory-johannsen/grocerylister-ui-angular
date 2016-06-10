'use strict'

/* jshint node:true */
var path = require('path')
var webpack = require('webpack')
const HtmlWebpackPlugin = require("html-webpack-plugin")

// You can require assets by qualifying them with either the app/assets/[subpath]
// -- e.g., require('templates/...'), require('images/...'), etc.
var qualifiedAssetsPath = path.resolve(path.join('app', 'assets'))
var jsPath = path.resolve(path.join('app'))

var IS_DEV = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV
var IS_TEST = process.env.NODE_ENV === 'test'
var IS_PROD = process.env.NODE_ENV === 'production'

if (!(IS_DEV || IS_TEST || IS_PROD)) {
  console.error('Error: NODE_ENV not understood')
  process.exit(1)
}

module.exports = {
  devtool: 'source-map',
  debug: true,
  entry: {
    application: jsPath + '/app.js',
    vendor: [
      'angular'
    ]
  },
  output: {
    path: 'dist',
    filename: '[name]-bundle.js'
  },
  module: {
    loaders: [
      { test: /[\/]angular\.js$/, loader: "exports?angular" },
      { test: /\.js$/, exclude: /node_modules/, loader: "6to5-loader" },
      { test: /\.html$/, exclude: /node_modules/, loader: "html-loader" },
      {
        test: /\.scss$/,
        // Query parameters are passed to node-sass
        loader: "style!css!sass?outputStyle=expanded&" +
        "includePaths[]=" +
        (path.resolve(__dirname, "./bower_components")) + "&" +
        "includePaths[]=" +
        (path.resolve(__dirname, "./node_modules"))
      }
    ]
  },
  plugins: [

    // Provide globals to shim old-school libs.
    new webpack.ProvidePlugin({
      jQuery: 'jquery',
      $: 'jquery',
      'window.jQuery': 'jquery'
    }),

    // Don't emit bundles with errored modules in them
    new webpack.NoErrorsPlugin(),

    new webpack.DefinePlugin({
      '__DEV__': JSON.stringify(IS_DEV),
      'API_ENDPOINT': IS_DEV ? 'http://localhost:9000' : 'http://grocerylister.api.johannsen.cloud:9000',
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      }
    })
  ],
  resolve: {
    root: '.',
    extensions: ['', '.js', '.json'],
    modulesDirectories: [
      './node_modules',
      jsPath,
      qualifiedAssetsPath
    ]
  }
}
