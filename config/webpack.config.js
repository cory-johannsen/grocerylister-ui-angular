'use strict'

/* jshint node:true */
var path = require('path')
var webpack = require('webpack')
var AssetsPlugin = require('assets-webpack-plugin')
var ChunkManifestPlugin = require('chunk-manifest-webpack-plugin')

// You can require assets by qualifying them with either the app/assets/[subpath]
// -- e.g., require('templates/...'), require('images/...'), etc.
var qualifiedAssetsPath = path.resolve(path.join('app', 'assets'))
var jsPath = path.resolve(path.join('app'))

// Only add the (e.g.) "-c8fe30a731adcb1a" suffix to output files when actually deploying.
var IS_DEV = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV
var IS_TEST = process.env.NODE_ENV === 'test'
var IS_PROD = process.env.NODE_ENV === 'production'

if (!(IS_DEV || IS_TEST || IS_PROD)) {
  console.error('Error: NODE_ENV not understood')
  process.exit(1)
}

var hash = IS_DEV ? '' : '-[chunkhash]'

var config = module.exports = {
  devtool: IS_DEV || IS_TEST ? 'inline-source-map' : 'source-map',
  entry: {
    application: jsPath + '/app.js'
  },
  output: {
    path: 'public/assets',
    filename: '[name]-bundle' + hash + '.js',
    chunkFilename: '[name]-bundle' + hash + '.js',
    publicPath: '/assets/',

    // Avoid the 'webpack://' location of (sourcemapped) JS files in debugger
    devtoolModuleFilenameTemplate: '[resourcePath]',
    devtoolFallbackModuleFilenameTemplate: '[resourcePath]?[hash]'
  },
  module: {
    loaders: [
      // XXX this list of extensions must match the list in directives/nrSrc.js XXX
      { test: /\.(png|jpg|gif)$/, loader: 'url?limit=100' },
      { test: /\.(woff|woff2)$/, loader: 'url?limit=10000' },
      { test: /\.(ttf|eot|svg)$/, loader: 'file' }
    ]
  },
  plugins: [
    // Automatically factor out common deps from main app and Data app entry points.
    new webpack.optimize.CommonsChunkPlugin('common-bundle' + hash + '.js', ['application', 'data-apps']),

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
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      }
    })
  ].concat(
    IS_PROD ? [
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } })
    ] : []
  ),
  resolve: {
    root: '.',
    extensions: ['', '.js', '.haml'],
    modulesDirectories: [
      './node_modules',
      jsPath,
      qualifiedAssetsPath
    ]
  }
}

if (IS_PROD) {
  config.plugins.push(new ChunkManifestPlugin({
    filename: 'webpack-common-manifest.json',
    manifestVariable: 'webpackBundleManifest'
  }))
  config.plugins.push(new AssetsPlugin({
    path: config.output.path,
    filename: 'webpack-asset-manifest.json'
  }))
}
