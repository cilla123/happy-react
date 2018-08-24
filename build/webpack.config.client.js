const path = require('path')
const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const HTMLPlugin = require('html-webpack-plugin')

const baseConfig = require('./webpack.config.base')
const GLOBAL_CONFIG = require('../deploy/index')

const isDev = process.env.NODE_ENV === 'development'

const config = webpackMerge(baseConfig, {
  entry: {
    app: path.join(__dirname, '../client/app.js'),
  },
  output: {
    filename: '[name].[hash].js',
  },
  plugins: [
    new HTMLPlugin({
      template: path.join(__dirname, '../src/client/index.html')
    }),
    // new HTMLPlugin({
    //   template: '!!ejs-compiled-loader!' + path.join(__dirname, '../client/server.template.ejs'),
    //   filename: 'server.ejs'
    // })
  ]
})

if (isDev) {
  // file enrty 
  config.entry = {
    app: [
      'react-hot-loader/patch',
      path.join(__dirname, '../src/client/app.js')
    ]
  },

  // file output
  config.output = {
    publicPath: GLOBAL_CONFIG.cdnPath
  }

  // local server is used to local test
  config.devServer = {
    host: '127.0.0.1',
    compress: true,
    port: '8888',
    contentBase: path.join(__dirname, '../dist'),
    hot: true,
    overlay: {
      errors: true
    },
    publicPath: GLOBAL_CONFIG.cdnPath,
    historyApiFallback: {
      index: `${GLOBAL_CONFIG.cdnPath}/index.html`
    },
    proxy: {
      '/api': 'http://localhost:3333'
    }
  }
  config.plugins.push(new webpack.HotModuleReplacementPlugin())
}

module.exports = config
