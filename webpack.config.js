/* eslint-env node */
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

/** import('webpack').Configuration */
const config = {
  entry: './src/main.tsx',
  target: 'web',
  output: {
    filename: '[name]-[contenthash].js',
    publicPath: '/',
    chunkFilename: '[name]-[id].js',
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
          compilerOptions: {
            importsNotUsedAsValues: 'remove',
            jsx: 'react-jsx',
          },
        },
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              modules: {
                localIdentName: '[local]--[hash:base64:5]',
              },
            },
          },
          {
            loader: 'less-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public/index.html'),
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser.js',
      Buffer: ['buffer', 'Buffer'],
    }),
    new MiniCssExtractPlugin({
      filename: '[name]-[hash].css',
    }),
    new webpack.EnvironmentPlugin({
      INFURA_ID: process.env.INFURA_ID || 'd74bd8586b9e44449cef131d39ceeefb',
    }),
  ],
  devServer: {
    contentBasePublicPath: '/',
    contentBase: path.resolve(__dirname, 'public'),
    hot: true,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    fallback: {
      os: 'os-browserify/browser',
      https: 'https-browserify',
      http: 'stream-http',
      stream: 'stream-browserify',
      util: 'util',
      assert: false,
      buffer: false,
    },
  },
  node: {
    global: true,
    __filename: false,
    __dirname: false,
  },
};

module.exports = config;
