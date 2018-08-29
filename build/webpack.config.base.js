/* eslint-disable */
const path = require('path')
const os = require('os')
const webpack = require('webpack');
const HTMLPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

// HappyPack是让webpack对loader的执行过程，从单一进程形式扩展为多进程模式，也就是将任务分解给多个子进程去并发的执行，子进程处理完后再把结果发送给主进程。从而加速代码构建 与 DLL动态链接库结合来使用更佳。
const HappyPack = require('happypack')
// 根据系统的内核数量指定线程池个数，也可以其他数量
const happyThreadPool = HappyPack.ThreadPool({
  size: os.cpus().length
})

// 全局环境配置
const GLOBAL_CONFIG = require('../deploy/index')

/**
 * 转换为绝对路径
 */
function resolve(dir) {
  return path.join(__dirname, dir);
}

const excludeSourcePaths = [resolve('../node_modules')]
const includeSourcePaths = [resolve('../src')]

module.exports = {
  
  // 文件入口
  entry: {
    app: resolve('../src/client/app.js'),
  },

  // 文件输出文件
  output: {
    filename: '[name].[hash].js',
    path: resolve('../dist'),
    publicPath: GLOBAL_CONFIG.cdnPath,
  },

  // 文件解析
  resolve: {
    // 后缀列表尽可能小, 频率最高的往前放, 导出语句尽可能带上后缀
    extensions: ['.js', '.jsx'],
    // 优化模块查找路径
    modules: [
      resolve('../src'),
      resolve('../node_modules'), // 指定node_modules所在位置 当import 第三方模块时 直接从这个路径下搜索寻找
    ],
    // 配置路径别名
    alias: {
      // 'vue$': 'vue/dist/vue.common.js', // $表示精确匹配，目前用不上
      components: resolve('../src/client/components'),
      bussiness_components: resolve('../src/client/bussiness_components'),
    },
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
      use: 'happypack/loader?id=babel',
      exclude: excludeSourcePaths,
      include: includeSourcePaths
    },{
      test: /.js$/,
      use: 'happypack/loader?id=babel',
      exclude: excludeSourcePaths,
      include: includeSourcePaths
    }],
    // 用了noParse的模块将不会被loaders解析，所以使用的库如果太大，并且其中不包含import require、define的调用，就可以使用这项配置来提升性能, 让 Webpack 忽略对部分没采用模块化的文件的递归解析处理。
    noParse: function (content) {
      return /jquery|lodash/.test(content)
    }
  },

  /**
   * webpack plugins
   */
  plugins: [
    new HTMLPlugin({
      template: path.join(__dirname, '../src/client/index.html')
    }),
    new CleanWebpackPlugin([resolve('../dist')]),
    new HappyPack({
      // 用id来标识 happypack处理那里类文件
      id: 'babel',
      // 如何处理  用法和loader的配置一样
      loaders: ['babel-loader?cacheDirectory'],
      // 共享进程池
      threadPool: happyThreadPool,
      // 允许 HappyPack 输出日志
      verbose: true,
    })
  ]
}