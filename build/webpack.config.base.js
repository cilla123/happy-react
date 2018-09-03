/* eslint-disable */
const path = require('path')
const os = require('os')
const HTMLPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

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

// 排除的代码路径
const excludeSourcePaths = [resolve('../node_modules')]
// 包含的代码路径
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

  // webpack根据下述条件自动进行代码块分割：
  // 新代码块可以被共享引用， OR这些模块都是来自node_modules文件夹里面
  // 新代码块大于30kb（ min + gziped之前的体积）
  // 按需加载的代码块， 最大数量应该小于或者等于5
  // 初始加载的代码块， 最大数量应该小于或等于3
  // optimization: {
  //   // runtimeChunk: {
  //   //     name: "manifest"
  //   // },
  //   splitChunks: {
  //     chunks: "initial", // 代码块类型 必须三选一： "initial"（初始化） | "all"(默认就是all) | "async"（动态加载）
  //     minSize: 0, // 最小尺寸，默认0
  //     minChunks: 1, // 最小 chunk ，默认1
  //     maxAsyncRequests: 1, // 最大异步请求数， 默认1
  //     maxInitialRequests: 1, // 最大初始化请求书，默认1
  //     name: () => {}, // 名称，此选项可接收 function
  //     cacheGroups: { // 缓存组会继承splitChunks的配置，但是test、priorty和reuseExistingChunk只能用于配置缓存组。
  //       commons: {
  //         chunks: 'initial',
  //         minChunks: 2,
  //         maxInitialRequests: 5,
  //         minSize: 0
  //       },
  //       vendor: { // 将第三方模块提取出来，key 为entry中定义的 入口名称
  //         test: /node_modules/,
  //         chunks: 'initial',
  //         name: 'vendor',
  //         priority: 10, // 缓存组优先级 false | object |
  //         enforce: true
  //       }
  //     }
  //   }
  // },

  // 文件解析
  resolve: {
    // 后缀列表尽可能小, 频率最高的往前放, 导出语句尽可能带上后缀
    extensions: ['.js', '.jsx'],
    // 优化模块查找路径
    modules: [
      resolve('../src'),
      resolve('../node_modules'), // 指定node_modules所在位置 当import 第三方模块时 直接从这个路径下搜索寻找
    ],
    // 配置路径别名，此处可以进行优化webpack的速度，让webpack以绝对路径来找引入的代码
    alias: {
      // 'vue$': 'vue/dist/vue.common.js', // $表示精确匹配，目前用不上
      '@components': resolve('../src/client/components'),
      '@bussiness_components': resolve('../src/client/bussiness_components'),
      '@views': resolve('../src/client/views'),
      '@images': resolve('../src/client/assets/images'),
    },
  },

  // 模块
  module: {
    rules: [{
      // enforce: 'pre',
      test: /.(js|jsx)$/,
      // loader: 'eslint-loader', // 目前先注释
      exclude: excludeSourcePaths,
      include: includeSourcePaths
    }, {
      test: /.jsx$/,
      use: 'happypack/loader?id=babel',
      exclude: excludeSourcePaths,
      include: includeSourcePaths
    }, {
      test: /.js$/,
      use: 'happypack/loader?id=babel',
      exclude: excludeSourcePaths,
      include: includeSourcePaths
    }, {
      test: /\.css$/,
      use: ['cache-loader', MiniCssExtractPlugin.loader, {
        loader: 'css-loader',
        options: {
          minimize: true //css压缩
        }
      }, 'postcss-loader'],
    }, {
      test: /\.(sass|scss)$/,
      loaders: ['cache-loader', MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
      exclude: excludeSourcePaths,
      include: includeSourcePaths
    }, {
      test: /\.(png|jpg|jpeg|gif|bmp)$/,
      use: [{
        loader: 'url-loader',
        options: { // 这里的options选项参数可以定义多大的图片转换为base64
          limit: 50000, // 表示小于50kb的图片转为base64,大于50kb的是路径
          outputPath: GLOBAL_CONFIG.cdnImagePath //定义输出的图片文件夹
        }
      }],
      exclude: excludeSourcePaths,
      include: includeSourcePaths
    }],
    // 用了noParse的模块将不会被loaders解析，所以使用的库如果太大，并且其中不包含import require、define的调用，就可以使用这项配置来提升性能, 让 Webpack 忽略对部分没采用模块化的文件的递归解析处理。
    // 但是node_modules中有的第三方框架有依赖lodash或者jquery之类的库，建议不要加入，不然容易报错
    noParse: function (content) {
      return /no-parser/.test(content); // 返回true则忽略对no-parser.js的解析
    }
  },

  // webpack的插件
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name]_[hash].css",
      chunkFilename: "[id]_[hash].css"
    }),
    new HTMLPlugin({
      template: path.join(__dirname, '../src/client/index.html')
    }),
    new CleanWebpackPlugin(
      ['dist', '.cache-loader'], {
        // 根目录
        root: resolve('../'),
        // 开启在控制台输出信息
        verbose: true,
        // 启用删除文件
        dry: false
      }
    ),
    new HappyPack({
      // 用id来标识 happypack处理那里类文件
      id: 'babel',
      // 如何处理  用法和loader的配置一样
      loaders: ['cache-loader', 'babel-loader?cacheDirectory'],
      // 共享进程池
      threadPool: happyThreadPool,
      // 允许 HappyPack 输出日志
      verbose: true,
    }),
    new HappyPack({
      // 用id来标识 happypack处理那里类文件
      id: 'css',
      // 如何处理  用法和loader的配置一样
      loaders: ['cache-loader', MiniCssExtractPlugin.loader, {
        loader: 'css-loader',
        options: {
          minimize: true //css压缩
        }
      }, 'postcss-loader'],
      // 共享进程池
      threadPool: happyThreadPool,
      // 允许 HappyPack 输出日志
      verbose: true,
    }),
    new HappyPack({
      // 用id来标识 happypack处理那里类文件
      id: 'sass',
      // 如何处理  用法和loader的配置一样
      loaders: ['cache-loader', MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
      // 共享进程池
      threadPool: happyThreadPool,
      // 允许 HappyPack 输出日志
      verbose: true,
    }),
  ]
}