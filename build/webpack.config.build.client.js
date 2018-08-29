/* eslint-disable */
const { GenerateSW } = require('workbox-webpack-plugin')
const AutoDllPlugin = require('autodll-webpack-plugin')
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')

// package.json
const package = require('../package.json')

const config = {
  plugins: [
    // pwa 插件
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
    }),
    // dll 生成
    new AutoDllPlugin({
      // 插入html
      inject: true,
      debug: true,
      filename: '[name]_[hash].js',
      entry: {
        vendor: Object.keys(package.dependencies).filter(item => {
          return item != 'vue'
        })
      }
    }),
    // 把对JS文件的串行压缩变为开启多个子进程并行进行uglify
    new ParallelUglifyPlugin({
      workerCount: 4,
      sourceMap: true,
      uglifyJS: {
        output: {
          beautify: false, // 不需要格式化
          comments: false // 保留注释
        },
        compress: { // 压缩
          warnings: false, // 删除无用代码时不输出警告
          drop_console: true, // 删除console语句
          collapse_vars: true, // 内嵌定义了但是只有用到一次的变量
          reduce_vars: true // 提取出出现多次但是没有定义成变量去引用的静态值
        }
      }
    })
  ]
}

module.exports = config;
