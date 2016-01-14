const path = require('path')
const fs = require('fs')
const Config = require('webpack-configurator')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const env = process.env.NODE_ENV || 'development'
const config = new Config()
const directory = process.cwd()

const modulesDirectories = [
  `${directory}/node_modules`,
  `${__dirname}/node_modules`,
  'node_modules'
]

const hasModules = fs.existsSync(path.join(__dirname, 'node_modules'))

const resolveBabelPackages = packages => {
  const modulePath = hasModules ? 'node_modules' : '../../node_modules'
  return packages.map(package => {
    return path.resolve(__dirname, modulePath, package)
  })
}

config
  .merge({
    entry: ['webpack-hot-middleware/client', './src'],
    output: {
      path: path.join(directory, 'public'),
      filename: '[name].js',
      publicPath: '/'
    },
    resolveLoader: {modulesDirectories},
    resolve: {modulesDirectories},
    devtool: 'eval',
    // devtool: 'cheap-module-eval-source-map'
  })
  .loader('js', {
    test: /\.jsx?$/,
    loader: 'babel',
    exclude: /(node_modules|bower_components)/,
    query: {
      presets: resolveBabelPackages(['babel-preset-react', 'babel-preset-es2015', 'babel-preset-stage-0']),
      plugins: resolveBabelPackages(['babel-plugin-transform-decorators-legacy']),
      env: {
        development: {
          presets: resolveBabelPackages(['babel-preset-react-hmre'])
        }
      }
    }
  })
  .plugin('webpack-define', webpack.DefinePlugin, [{
    'process.env': {
      NODE_ENV: JSON.stringify(env)
    }
  }])
  .plugin('webpack-order', webpack.optimize.OccurenceOrderPlugin)
  .plugin('webpack-noerrors', webpack.NoErrorsPlugin)
  .plugin('webpack-html', HtmlWebpackPlugin, [{
    template: `${__dirname}/index.html`,
    hash: true,
    inject: 'body'
  }])

// development
if (env == 'development') {
  config.plugin('webpack-hmr', webpack.HotModuleReplacementPlugin)
}

// production
if (env == 'production') {
  config
    .merge({devtool: 'source-map'})
    .plugin('webpack-uglify', webpack.optimize.UglifyJsPlugin, [{
      compressor: { warnings: false }
    }])
}

// merge in user-configs
// accepts {} or function(config)
const userConfig = path.resolve(directory, './webpack.config.js')
if (fs.existsSync(userConfig)) {
  config.merge(require(userConfig))
}

module.exports = config
