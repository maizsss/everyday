var config = require('./webpack.base.config')

config.devtool = 'eval-source-map'

config.devServer = {
  noInfo: true
}

// test
delete config.entry.index
config.entry.test = './src/js/index.js'
config.output.filename = 'index.js'

module.exports = config
