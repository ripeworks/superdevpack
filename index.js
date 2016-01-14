const path = require('path')
const fs = require('fs')
const Config = require('webpack-configurator')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const config = new Config()

config
  .merge({
    entry: ['webpack-hot-middleware/client', './src'],
    output: {
      path: path.join(process.cwd(), 'public'),
      filename: '[name].js',
      publicPath: '/'
    },
    devtool: 'eval',
    // devtool: 'cheap-module-eval-source-map'
  })
  .loader('js', {
    test: /\.jsx?$/,
    loader: 'babel',
    exclude: /(node_modules|bower_components)/,
    query: {
      presets: ['react', 'es2015', 'stage-0'],
      plugins: ['transform-decorators-legacy'],
      env: {
        development: {
          presets: ['react-hmre']
        }
      }
    }
  })
  .plugin('webpack-define', webpack.DefinePlugin, [{
    __DEV__: true,
    'process.env': {
      // 'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      NODE_ENV: JSON.stringify('development')
    }
  }])
  .plugin('webpack-order', webpack.optimize.OccurenceOrderPlugin)
  .plugin('webpack-hmr', webpack.HotModuleReplacementPlugin)
  .plugin('webpack-noerrors', webpack.NoErrorsPlugin)
  .plugin('webpack-html', HtmlWebpackPlugin, [{
    template: __dirname + '/index.html',
    hash: true,
    inject: 'body'
  }])

// merge in user-configs
// accepts {} or function(config)
const userConfig = path.resolve(process.cwd(), './webpack.config.js')
if (fs.existsSync(userConfig)) {
  config.merge(require(userConfig))
}

module.exports = config
