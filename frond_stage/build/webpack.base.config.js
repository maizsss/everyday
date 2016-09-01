var ExtractTextPlugin = require("extract-text-webpack-plugin")

module.exports = {
  entry: {
    index: './src/js/index.js'
  },
  output: {
    path: './dist/',
    publicPath: '/dist/',
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue'
      },
      {
        test: /\.js$/,
        loader: 'babel',
        // make sure to exclude 3rd party code in node_modules
        exclude: /node_modules/
      },
      {
        // edit this for additional asset file types
        test: /\.(png|jpg|gif)$/,
        loader: 'url',
        query: {
          // inline files smaller then 10kb as base64 dataURL
          limit: 1000,
          // fallback to file-loader with this naming scheme
          name: '[name].[ext]',
        }
      }
    ]
  },
  // vue-loader config:
  vue: {
    loaders: {
      js: 'babel',
      css: ExtractTextPlugin.extract("css",
        {
          publicPath: "../dist/"
        }
      ),
      less: ExtractTextPlugin.extract("css!less",
        {
          publicPath: "../dist/"
        }
      ),
    }
  },
  babel: {
    presets: ['es2015'],
    plugins: ['transform-runtime']
  },
  plugins: [
    new ExtractTextPlugin("index.css"),
  ]
}
