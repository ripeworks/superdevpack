#!/usr/bin/env node

const program = require('commander')
const fs = require('fs')

program
  //.version()
  .option('-p, --port <port>', 'Set port. Defaults to 3000', '3000')
  .parse(process.argv)

const app = require('../')()

app.listen(program.port, 'localhost', function(err) {
  if (err) {
    console.log(err)
    return
  }

  console.log('Listening at http://localhost:' + program.port)
})
