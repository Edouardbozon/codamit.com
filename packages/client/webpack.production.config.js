const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const Dotenv = require('dotenv-webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const { HashedModuleIdsPlugin } = require('webpack');
const common = require('./webpack.common.config');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'nosources-source-map',
  stats: {
    colors: false,
    hash: true,
    timings: true,
    assets: true,
    chunks: true,
    chunkModules: true,
    modules: true,
    children: true,
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          chunks: 'initial',
          minChunks: 2,
          maxInitialRequests: 5, // The default limit is too small to showcase the HttpEffect
          minSize: 0, // This is example is too small to create commons chunks
        },
        vendor: {
          test: /node_modules/,
          chunks: 'initial',
          name: 'vendor',
          priority: 10,
          enforce: true,
        },
      },
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Codamit - Tech Blog',
      template: path.resolve(__dirname, 'src', 'index.html'),
      minify: true,
      hash: true,
      chunksSortMode: 'none',
    }),
    new Dotenv({
      path: path.resolve(__dirname, '.env'),
    }),
    new HashedModuleIdsPlugin(),
    new WorkboxPlugin.GenerateSW({
      swDest: 'sw.js',
      clientsClaim: true,
      skipWaiting: true,
      importWorkboxFrom: 'local',
      maximumFileSizeToCacheInBytes: 4 * 1024 * 1024, // 4mb
      runtimeCaching: [
        {
          urlPattern: new RegExp('^https://www.api.codamit.dev/'),
          handler: 'NetworkFirst',
          options: {
            cacheName: 'api-cache',
            fetchOptions: {
              mode: 'cors',
            },
          },
        },
        {
          urlPattern: new RegExp('^https://www.dropbox.com/'),
          handler: 'CacheFirst',
          options: {
            cacheName: 'image-cache',
          },
        },
        {
          urlPattern: new RegExp('^https://fonts.googleapis.com/'),
          handler: 'CacheFirst',
          options: {
            cacheName: 'font-cache',
          },
        },
      ],
    }),
  ],
});