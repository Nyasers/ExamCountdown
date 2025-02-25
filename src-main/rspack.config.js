/**
 * @type {import('@rspack/core').Configuration}
 */

import rspack from '@rspack/core'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import fs from 'fs'
import path, { dirname } from 'path'
import TerserPlugin from 'terser-webpack-plugin'
import { fileURLToPath } from 'url'

import terserConfig from './terser.config.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const MODE = true ? 'production' : 'development'

if (MODE == 'production') {
  terserConfig.compress.drop_console = true
}

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

const workerEntry = {}
const workerContent = {}

export default [
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
            const entrypoints = stats.toJson().entrypoints

            Object.keys(entrypoints).forEach((entryName) => {
              const entryFiles = entrypoints[entryName].assets
              const entryFilename = entryFiles[0].name
              workerEntry[entryName] = path.join(stats.compilation.outputOptions.path, entryFilename)
              workerContent[entryName] = JSON.stringify(fs.readFileSync(workerEntry[entryName], 'utf-8'))

              console.info(`Worker ${entryName} generated: ${workerEntry[entryName]}`, workerContent[entryName].length)
            })
          })
        }
      },
    ],
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: terserConfig,
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
      new rspack.DefinePlugin({ TAURI: true }),
      new rspack.CopyRspackPlugin({
        patterns: [
          { from: '../src-tauri/icons/icon.ico', to: 'favicon.ico' },
          { from: './src/pages/' },
        ]
      }),
      new CleanWebpackPlugin(),
      {
        apply: compiler => {
          compiler.hooks.beforeRun.tap('MyRspackPlugin', function (_stats) {
            new rspack.DefinePlugin({
              WORKERS: workerContent
            }).apply(compiler)
            console.log('Workers defined: ', Object.keys(workerContent))
          })
        }
      },
    ],
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: terserConfig,
        })
      ],
    },
  },
]
