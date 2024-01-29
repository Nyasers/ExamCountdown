const webpack = require('webpack');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin')

var ncache;

const commonPostcssLoader = {
  loader: 'postcss-loader',
  options: {
    postcssOptions: {
      plugins: [
        'postcss-preset-env'
      ]
    }
  }
}

module.exports =
{
  entry: {
    base: './src/base/index.js',
    extension: './src/extension/index.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          //'style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader',
          commonPostcssLoader
        ],
      }
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'VERSION': '"2024/01/28"',
    }),
    new webpack.ProvidePlugin({
      '$': 'jquery',
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css'
    }),
    new CopyPlugin({
      patterns: [
        { from: './src/cmd/' },
        { from: './src/pages/' },
        { from: './src/jpg/default.jpg' }
      ],
    }),
    new CleanWebpackPlugin()
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          ecma: 2016,
          compress: {
            passes: 3,
            unsafe: true,
            unsafe_arrows: true,
            unsafe_regexp: true,
            unsafe_comps: true,
            unsafe_Function: true,
            unsafe_math: true,
            unsafe_proto: true,
          },
          mangle: {
            reserved: ['ec'],
          },
          module: true,
          format: {
            comments: false,
          },
          toplevel: true,
          nameCache: ncache,
        },
      }),
      new CssMinimizerWebpackPlugin()
    ],
  },
};