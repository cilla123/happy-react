/* eslint-disable */
const path = require('path')

module.exports = {
  output: {
    path: path.join(__dirname, '../dist'),
    publicPath: '/public/',
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [{
      enforce: 'pre',
      test: /.(js|jsx)$/,
      loader: 'eslint-loader',
      exclude: [
        path.resolve(__dirname, '../node_modules')
      ],
    },{
      test: /.jsx$/,
      use: 'babel-loader?cacheDirectory'
    },{
      test: /.js$/,
      use: 'babel-loader?cacheDirectory',
      exclude: [
        path.join(__dirname, '../node_modules')
      ]
    }]
  },
}