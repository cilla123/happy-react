/* eslint-disable */
const path = require('path')
const {
  NamedModulesPlugin,
  HotModuleReplacementPlugin
} = require('webpack')

const GLOBAL_CONFIG = require('../deploy/index')

const config = {
  // 文件入口
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
    inline: true,
    contentBase: path.join(__dirname, '../dist'),
    publicPath: GLOBAL_CONFIG.cdnPath,
    historyApiFallback: {
      index: `${GLOBAL_CONFIG.cdnPath}/index.html`
    },
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
  plugins: [
    new NamedModulesPlugin(),
    new HotModuleReplacementPlugin(),
  ],
}

module.exports = config;
