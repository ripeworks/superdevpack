#!/usr/bin/env node

const program = require('commander')
const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const express = require('express')

program
  //.version()
  .option('-p, --port <port>', 'Set port. Defaults to 3000', '3000')
  .parse(process.argv)

const directory = path.resolve('.')
const config = require('../').resolve()

const app = express()
const compiler = webpack(config)

const devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: config.output.publicPath,
  stats: true
})
app.use(devMiddleware)
app.use(require('webpack-hot-middleware')(compiler))

app.use(express.static(config.output.path))
app.get('*', function(req, res) {
  if (req.accepts('html')) {
    const indexPath = path.join(config.output.path, 'index.html')
    const index = devMiddleware.fileSystem.readFileSync(indexPath)
    res.set('Content-Type', 'text/html')
    res.send(index)
  }
})

app.listen(program.port, 'localhost', function(err) {
  if (err) {
    console.log(err)
    return
  }

  console.log('Listening at http://localhost:' + program.port)
})
