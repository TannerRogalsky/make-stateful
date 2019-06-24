'use strict';

module.exports = {
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  output: {
    library: 'make-stateful',
    libraryTarget: 'umd',
    filename: 'make-stateful',
  },
  resolve: {
    extensions: ['.js']
  }
};
