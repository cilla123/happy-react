/* eslint-disable */
const path = require('path')
const { NamedModulesPlugin, HotModuleReplacementPlugin, DllReferencePlugin } = require('webpack')

const GLOBAL_CONFIG = require('../deploy/index')

const config = {
  // file enrty
  entry: {
    app: [
      'react-hot-loader/patch',
      path.join(__dirname, '../src/client/app.js')
    ]
  },
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
  plugins: [
    new NamedModulesPlugin(),
    new HotModuleReplacementPlugin(),
  ],
}

module.exports = config;
