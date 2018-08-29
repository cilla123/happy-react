/* eslint-disable */
const merge = require('webpack-merge')

const baseConfig = require('./webpack.config.base.js')

let config
if (process.env.NODE_ENV === 'production') {
  config = require('./webpack.config.build.client')
} else {
  config = require('./webpack.config.dev.client')
}

module.exports = merge(baseConfig, config)