/**
 * @type {import('webpack').Configuration}
 */

const webpack = require('webpack');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const TerserOptions = import('./terser.config.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');

const VERSION = '"2024/03/20"';

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

module.exports = [
  {
    name: 'step1',
    mode: 'production',
    entry: {
      index: './src/base/css/index.js',
      extension: './src/extension/css/index.js',
    },
    output: {
      path: path.resolve(__dirname, 'cache'),
      filename: '[name].js'
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            commonPostcssLoader,
          ],
        }
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].css'
      }),
      new CleanWebpackPlugin()
    ],
    optimization: {
      minimize: true,
      minimizer: [
        new CssMinimizerWebpackPlugin()
      ],
    },
  },
  {
    name: 'step2',
    mode: 'production',
    dependencies: ['step1'],
    entry: {
      index: './src/base/index.js',
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
            'style-loader',
            'css-loader',
          ],
        }
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        'VERSION': VERSION,
      }),
      new CopyPlugin({
        patterns: [
          { from: './src/cmd/' },
          { from: './src/json/' },
          { from: './src/webp/' },
          { from: './src/pages/' },
        ]
      }),
      new CleanWebpackPlugin(),
    ],
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: TerserOptions,
        })
      ],
    },
  },
];
