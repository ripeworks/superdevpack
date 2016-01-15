# Super Devpack

A configurable webpack development server, geared for React and Hot Module Reloading.

## Installation

```
$ npm install superdevpack
```

## Usage

```
$ superdevpack -h

  Usage: superdevpack [options] [command]


  Commands:

    start       Start development server
    build       Production build
    help [cmd]  display help for [cmd]

  Options:

    -h, --help  output usage information
```

## What's inside?

* Babel 6
* React preset
* ES2015 preset
* stage-0 preset
* legacy decorator syntax
* React HMRE + redbox
* Webpack loaders
  * babel-loader
  * css-loader
  * file-loader
  * script-loader
  * style-loader
  * url-loader

## Customize webpack configuration

If you include a `webpack.config.js` file in your project root, superdevpack will pick it up and merge it into its default configuration. You can either export an object to merge, or a function to replace the configuration.

```
// webpack.config.js

module.exports = {} // object contents are merged into base configuration

module.exports = function(config) {
  // override/replace any configuration and return the new configuration
  return config
}
```
