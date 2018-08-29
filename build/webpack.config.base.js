/* eslint-disable */
const path = require('path')
const os = require('os')
const webpack = require('webpack');
const HTMLPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

const HappyPack = require('happypack')
const happyThreadPool = HappyPack.ThreadPool({
  size: os.cpus().length
})

const GLOBAL_CONFIG = require('../deploy/index')

/**
 * path resolve
 */
function resolve(dir) {
  return path.join(__dirname, dir);
}

const excludeSourcePaths = [resolve('../node_modules')]
const includeSourcePaths = [resolve('../src')]

module.exports = {
  /**
   * file enrty
   */
  entry: {
    app: resolve('../src/client/app.js'),
  },

  /**
   * file outout
   */
  output: {
    filename: '[name].[hash].js',
    path: resolve('../dist'),
    publicPath: GLOBAL_CONFIG.cdnPath,
  },

  resolve: {
    extensions: ['.js', '.jsx'],
  },
  
  module: {
    rules: [{
      enforce: 'pre',
      test: /.(js|jsx)$/,
      loader: 'eslint-loader',
      exclude: excludeSourcePaths,
      include: includeSourcePaths
    },{
      test: /.jsx$/,
      loader: 'babel-loader?cacheDirectory',
      exclude: excludeSourcePaths,
      include: includeSourcePaths
    },{
      test: /.js$/,
      loader: 'babel-loader?cacheDirectory',
      exclude: excludeSourcePaths,
      include: includeSourcePaths
    }]
  },

  /**
   * webpack plugins
   */
  plugins: [
    new HTMLPlugin({
      template: path.join(__dirname, '../src/client/index.html')
    }),
    new CleanWebpackPlugin([resolve('dist')]),
    // new HappyPack({
    //   // 用id来标识 happypack处理那里类文件
    //   id: 'jsAndjsx',
    //   // 如何处理  用法和loader的配置一样
    //   loaders: [{
    //     loader: 'babel-loader',
    //     cacheDirectory: true
    //   }],
    //   // 共享进程池
    //   threadPool: happyThreadPool,
    //   // 允许 HappyPack 输出日志
    //   verbose: true,
    // })
  ]
}