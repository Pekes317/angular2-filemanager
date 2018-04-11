const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: [
    // Specify scss files
    './filemanager-lib/src/styles/main.scss'
  ],
  output: {	},
  module: {
    // Add loader
    rules: [{
			test: /\.scss$/,
			loader: ExtractTextPlugin.extract(['css-loader', 'sass-loader'])
		}]
  },
  plugins: [
    // Specify output file name and path
    new ExtractTextPlugin({
      filename: './dist/ngx-filemanager/style.css'
    })
  ]
};