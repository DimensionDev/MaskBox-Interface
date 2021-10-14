/* eslint-env node */
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

/** import('webpack').Configuration */
const config = {
  entry: './src/main.tsx',
  target: 'web',
  output: {
    publicPath: '/',
  },
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
          {
            loader: 'style-loader',
          },
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
