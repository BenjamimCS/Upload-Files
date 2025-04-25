const path = require("path")
const htmlWebpackPlugin = require('html-webpack-plugin')
//const postcssLoaderOptions = {
//  loader: 'postcss-loader',
//  options: {
//    postcssOptions: {
//      plugins: [
//        'postcss-preset-env',
//        '@tailwindcss/postcss',
//      ]
//    }
//  }
//}

function whichMode() {
  return process.env.NODE_ENV === 'development'
    ? 'development'
    : 'production'
}

module.exports = {
  mode: whichMode(),
  entry: './src/frontend/entry.js',
  output: {
    filename: 'script.js',
    path: path.resolve(__dirname, 'public/'),
    clean: {
      keep(filename) {
        const allowExtRegex = '/^.+\.(php|jsonc?)$/'
        return Boolean(filename.matchAll(allowExtRegex))
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        type: 'asset/resource',
        generator: {
        filename: '[name][ext]',
          outputPath: './assets/'
        }
      },
//    {
//      test: /\.s?(a|c)ss$/,
//      use: [
//        'style-loader',
//        'css-loader',
//        postcssLoaderOptions,
//        'sass-loader'
//      ]
//    }
    ]
  },
  plugins: [
    new htmlWebpackPlugin({
      template: './src/frontend/template.html'
    })
  ]
  // devtool: 'eval-cheap-module-source-map'
}
