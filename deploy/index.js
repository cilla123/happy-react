const localConfig =require('./local/config')
const devConfig = require('./dev/config')
const prodConfig = require('./prod/config')
const testConfig = require('./test/config')

/**
 * get enviroment
 */
const getEnviroment = () => {
  return process.env.NODE_ENV
}

/**
 * merge environment config
 */
const mergeConfig = () => {
  const env = getEnviroment()
  let config = {}
  switch (env) {
    case 'development':
      config = Object.assign(localConfig, devConfig)
      break;
    case 'test':
      config = Object.assign(localConfig, testConfig)
      break;
    case 'production':
      config = Object.assign(localConfig, prodConfig)
      break;
    default:
      config = localConfig
      break;
  }
  return config
}

module.exports = mergeConfig()