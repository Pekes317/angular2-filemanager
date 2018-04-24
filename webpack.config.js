const path = require('path');

module.exports = {
  entry: [
    // Specify scss files
    './filemanager-lib/src/styles/main.scss'
  ],
  output: {
    filename: 'ngx-filemanager/style.css'
  },
  module: {
    // Add loader
    rules: [{
      test: /\.scss$/,
      loader: ['css-loader', 'sass-loader']
    }]
  }
};
