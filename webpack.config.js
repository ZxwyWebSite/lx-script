const path = require('path');
const webpack = require('webpack');
const packageJson = require('./package.json');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production',
  target: 'web',
  entry: path.join(__dirname, './src/index.js'),
  output: {
    filename: 'lx-source-script.js',
    path: path.join(__dirname, './dist'),
  },
  // module: {
  //   rules: [
  //     {
  //       test: /\.js$/,
  //       loader: 'babel-loader',
  //       exclude: /node_modules/,
  //     },
  //   ],
  // },
  plugins: [
    new webpack.BannerPlugin(`@name Lx-Source-Script
@description 洛雪音乐自定义源脚本
@version v${packageJson.version}
@author ${packageJson.author}
@homepage https://github.com/ZxwyWebSite/lx-script`),
    new webpack.DefinePlugin({
      mode: JSON.stringify(process.env.NODE_ENV),
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
};
