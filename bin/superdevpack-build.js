#!/usr/bin/env node

const program = require('commander')
const webpack = require('webpack')
const colors  = require('supports-color')

program
  //.version()
  .parse(process.argv)

const config = require('../config')
const compiler = webpack(config)
const outputOptions = {
  cached: false,
  cachedAssets: false,
  colors: colors,
  exclude: ['node_modules', 'bower_components']
}

compiler.run((err, stats) => {
  if (err) {
    console.error(err.stack || err)
    if (err.details) console.error(err.details)
    process.on('exit', () => process.exit(1))
  }

  process.stdout.write(stats.toString(outputOptions) + "\n")

  if (stats.hasErrors()) {
    process.on('exit', () => process.exit(2))
  }
})
