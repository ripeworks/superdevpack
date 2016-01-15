#!/usr/bin/env node

process.env.NODE_ENV = 'production'

const program = require('commander')
const webpack = require('webpack')

program
  //.version()
  .parse(process.argv)

const config = require('../config')
const compiler = webpack(config)

// compiler.apply(new webpack.ProgressPlugin())
compiler.run((err, stats) => {
  if (err) {
    console.log(err)
  } else {
    console.log('Build successful')
  }
})
