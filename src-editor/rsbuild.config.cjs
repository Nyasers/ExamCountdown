const { defineConfig } = require('@rsbuild/core');
const { pluginVue } = require('@rsbuild/plugin-vue');
const path = require('path');

module.exports = defineConfig({
  mode: 'production', // or 'development' or 'production'
  plugins: [
    pluginVue(),
  ],
  source: {
    entry: {
      index: path.resolve(__dirname, 'src', 'main.js'),
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  output: {
    cleanDistPath: true,
    filenameHash: false,
    distPath: {
      js: '',
      css: '',
    },
    disableHtmlFolder: true,
  },
  tools: {
    htmlPlugin: false,
  },
  performance: {
    chunkSplit: {
      strategy: 'all-in-one',
    },
  },
});