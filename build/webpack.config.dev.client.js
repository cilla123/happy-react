/* eslint-disable */
const path = require('path')
const { NamedModulesPlugin, HotModuleReplacementPlugin } = require('webpack')
const webpackMerge = require('webpack-merge')

const baseConfig = require('./webpack.config.base')
const GLOBAL_CONFIG = require('../deploy/index')

const isDev = process.env.NODE_ENV === 'development'

const config = webpackMerge(baseConfig, {
  // file enrty
  entry: {
    app: [
      'react-hot-loader/patch',
      path.join(__dirname, '../src/client/app.js')
    ]
  },
  plugins: [
    new NamedModulesPlugin(),
    new HotModuleReplacementPlugin()
  ],
  // local server is used to local test
  devServer: {
    host: '127.0.0.1',
    port: 8080,
    compress: true,
    hot: true,
    overlay: {
      errors: true,
    },
    contentBase: path.join(__dirname, '../dist'),
    publicPath: GLOBAL_CONFIG.cdnPath,
    historyApiFallback: {
      index: `${GLOBAL_CONFIG.cdnPath}/index.html`
    },
    proxy: {
      '/api': 'http://localhost:3333',
    },
  },
})

module.exports = config;
