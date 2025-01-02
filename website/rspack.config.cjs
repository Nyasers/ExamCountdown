/**
 * @type {import('@rspack/core').Configuration}
 */

const fs = require('fs');
const path = require('path');
const rspack = require('@rspack/core');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserOptions = import('./terser.config.js');

const MODE = true ? 'production' : 'development';
// const VERSION = '"2024-06-14T17:00Z"';

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

var workerEntry = {};
var workerContent = {};

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
            rspack.CssExtractRspackPlugin.loader,
            'css-loader',
            commonPostcssLoader,
          ],
        }
      ],
    },
    plugins: [
      new rspack.CssExtractRspackPlugin({
        filename: '[name].css'
      }),
      new CleanWebpackPlugin(),
    ],
    optimization: {
      minimize: true,
      minimizer: [
        new rspack.LightningCssMinimizerRspackPlugin()
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
          compiler.hooks.done.tap('MyRspackPlugin', function (stats) {
            const entrypoints = stats.toJson().entrypoints;

            Object.keys(entrypoints).forEach((entryName) => {
              const entryFiles = entrypoints[entryName].assets;
              const entryFilename = entryFiles[0].name;
              workerEntry[entryName] = path.join(stats.compilation.outputOptions.path, entryFilename);
              workerContent[entryName] = JSON.stringify(fs.readFileSync(workerEntry[entryName], 'utf-8'));

              console.log(`Worker ${entryName} generated: ${workerEntry[entryName]}`, workerContent[entryName].length);
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
      // update: './src/update/index.js',
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
      // new webpack.DefinePlugin({
      //   'VERSION': VERSION,
      // }),
      new rspack.CopyRspackPlugin({
        patterns: [
          { from: '../assets/icon.ico', to: 'favicon.ico' },
          // { from: './src/cmd/' },
          // { from: './src/json/' },
          { from: './src/pages/' },
        ]
      }),
      new CleanWebpackPlugin(),
      {
        apply: compiler => {
          compiler.hooks.beforeRun.tap('MyRspackPlugin', function (_stats) {
            new rspack.DefinePlugin({
              WORKERS: workerContent
            }).apply(compiler);
            console.log('Workers defined: ', Object.keys(workerContent));
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
