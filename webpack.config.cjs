/**
 * @type {import('webpack').Configuration}
 */

const webpack = require('webpack');
const fs = require('fs');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const TerserOptions = import('./terser.config.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');

const MODE = false ? 'production' : 'development';
const VERSION = '"2024-06-14T10:00Z"';

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

var workerEntry = [];
var workerContent = [];

module.exports = [
  {
    name: 'css',
    mode: MODE,
    entry: {
      index: './src/index/css/index.js',
      hitokoto: './src/plugin/Hitokoto/css/index.js',
    },
    output: {
      publicPath: '',
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
      new CleanWebpackPlugin(),
    ],
    optimization: {
      minimize: true,
      minimizer: [
        new CssMinimizerWebpackPlugin()
      ],
    },
  },
  {
    name: 'workers',
    mode: MODE,
    dependencies: [],
    entry: {
      'image-loader': './src/workers/image-loader.worker.js',
    },
    output: {
      publicPath: '',
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].worker.js',
    },
    plugins: [
      new CleanWebpackPlugin(),
      {
        apply: compiler => {
          compiler.hooks.done.tap('MyWebpackPlugin', function (stats) {
            const entrypoints = stats.toJson().entrypoints;

            Object.keys(entrypoints).forEach((entryName) => {
              const entryFiles = entrypoints[entryName].assets;
              const entryFilename = entryFiles[0].name;
              workerEntry[entryName] = path.join(stats.compilation.outputOptions.path, entryFilename);
              workerContent[entryName] = JSON.stringify(fs.readFileSync(workerEntry[entryName], 'utf-8'));
            });
          });
        }
      },
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
  {
    name: 'app',
    mode: MODE,
    dependencies: ['css', 'workers'],
    entry: {
      index: './src/index/index.js',
      update: './src/update/index.js',
    },
    output: {
      publicPath: '',
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
          { from: './src/pages/' },
        ]
      }),
      new CleanWebpackPlugin(),
      {
        apply: compiler => {
          compiler.hooks.beforeRun.tap('MyWebpackPlugin', function (stats) {
            new webpack.DefinePlugin({
              WORKERS: workerContent
            }).apply(compiler);
          });
        }
      },
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
