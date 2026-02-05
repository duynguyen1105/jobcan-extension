const {resolve} = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const {CleanWebpackPlugin} = require("clean-webpack-plugin");

const TARGET_BROWSER = process.env.TARGET_BROWSER || 'chrome';
const manifestFile = TARGET_BROWSER === 'firefox' ? 'manifest.firefox.json' : 'manifest.json';

const tsRule = {
  test: /\.ts(x?)$/,
  exclude: /node_modules/,
  use: 'ts-loader',
}

const plugins = [
  new HTMLWebpackPlugin({
    template: 'src/popup-page/popup.html',
    filename: 'popup.html',
    chunks: ['popup'],
  }),
  new CopyWebpackPlugin({
    patterns: [
      {from: `public/${manifestFile}`, to: "manifest.json"},
      {from: "src/popup-page/fouc-prevention.js", to: "fouc-prevention.js"},
    ],
  }),
  new CleanWebpackPlugin(),
];

module.exports = {
  mode: "development",
  devtool: 'cheap-module-source-map',
  entry: {
    popup: './src/popup-page/popup.tsx',
    contentscript: './src/contentscript.ts',
  },
  output: {
    filename: '[name].js',
    path: resolve(__dirname, 'dist', TARGET_BROWSER),
  },
  module: {
    rules: [tsRule],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  plugins,
}
