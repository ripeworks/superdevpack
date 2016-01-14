#!/usr/bin/env node

process.env.NODE_ENV = 'production'

const program = require('commander')
const path = require('path')
const webpack = require('webpack')

program
  //.version()
  .parse(process.argv)

const directory = path.resolve('.')
const config = require('../').resolve()

const compiler = webpack(config)

// compiler.apply(new webpack.ProgressPlugin())
compiler.run((err, stats) => {
  if (err) {
    console.log(err)
  } else {
    console.log('Build successful')
  }
})
