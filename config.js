const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const env = process.env.NODE_ENV || 'development'
const directory = process.cwd()

const modulesDirectories = [
  `${directory}/node_modules`,
  `${__dirname}/node_modules`,
  'node_modules'
]

const resolveBabelPackages = pkgs => {
  return pkgs.map(pkg => {
    const modulePath = fs.existsSync(path.join(__dirname, 'node_modules', pkg)) ? 'node_modules' : '../../node_modules'
    return path.resolve(__dirname, modulePath, pkg)
  })
}

const config = {
  entry: ['webpack-hot-middleware/client', './src'],
  output: {
    path: path.join(directory, 'public'),
    filename: '[name].js',
    publicPath: '/'
  },
  resolveLoader: {modulesDirectories},
  resolve: {modulesDirectories},
  devtool: 'cheap-module-eval-source-map',
  module: {
    loaders: [
      {
        test: /\.jsx?$/, loader: 'babel',
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
      },
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify(env) }
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.NoErrorsPlugin(),
    new HtmlWebpackPlugin({
      template: `${__dirname}/index.html`,
      hash: true,
      inject: 'body'
    })
  ]
}

// production
if (env == 'production') {
  config.devtool = 'source-map'
  config.plugins.push(
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyPlugin({
      compressor: { warnings: false },
      output: { comments: false }
    })
  )
} else {
  config.plugins.push(new webpack.HotModuleReplacementPlugin())
}

// merge in user-configs
// accepts {} or function(config)
const userConfig = config => {
  const configPath = path.resolve(directory, './webpack.config.js')
  if (fs.existsSync(configPath)) {
    const userWebpackConfig = require(configPath)
    if (typeof userWebpackConfig === 'function') {
      return userWebpackConfig(config)
     } else {
      return Object.assign(config, userWebpackConfig)
    }
  }

  return config
}

const finalConfig = userConfig(config)

module.exports = finalConfig
