const path = require('path')
const webpack = require('webpack')
const express = require('express')
const history = require('connect-history-api-fallback')

const config = require('./config')

module.exports = function(options) {

  options = Object.assign({
    middleware: [],
    static: true,
    fallback: '/index.html'
  }, options)

  const compiler = webpack(config)
  const app = express()

  if (options.fallback) {
    app.use(history({index: options.fallback}))
  }

  for (const middleware of options.middleware) {
    app.use(middleware)
  }

  const devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: config.output.publicPath,
    stats: true
  })
  app.use(devMiddleware)
  app.use(require('webpack-hot-middleware')(compiler, {
    reload: true
  }))

  if (options.static) {
    app.use(express.static(config.output.path))
  }

  return app
}
