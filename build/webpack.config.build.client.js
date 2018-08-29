/* eslint-disable */
const path = require('path')
const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const HTMLPlugin = require('html-webpack-plugin')
const { GenerateSW } = require('workbox-webpack-plugin')

const baseConfig = require('./webpack.config.base')
const GLOBAL_CONFIG = require('../deploy/index')

const config = webpackMerge(baseConfig, {
  plugins: [
    // new HTMLPlugin({
    //   template: '!!ejs-compiled-loader!' + path.join(__dirname, '../client/server.template.ejs'),
    //   filename: 'server.ejs'
    // })
    // pwa workbox plugins
    new GenerateSW({
      // set prefix
      cacheId: 'webpack-pwa',
      skipWaiting: true, // 强制等待中的 Service Worker 被激活
      clientsClaim: true, // Service Worker 被激活后使其立即获得页面控制权
      swDest: 'service-wroker.js', // 输出 Service worker 文件
      globPatterns: ['**/*.{html,js,css,png.jpg}'], // 匹配的文件
      globIgnores: ['service-wroker.js'], // 忽略的文件
      // 配置路由请求缓存
      runtimeCaching: [{
        urlPattern: /.*\.js/, // 匹配文件
        handler: 'networkFirst' // 网络优先
      }]
    })
  ]
})

module.exports = config;
