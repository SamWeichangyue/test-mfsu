const { dirname, resolve, join, extname } = require('path')
const webpack = require('webpack');
const  HtmlWebpackPlugin = require("html-webpack-plugin");
const  MiniCssExtractPlugin = require("mini-css-extract-plugin");
const cwd = process.cwd();

const config = {
  entry: resolve(cwd, './src/index.js'),
  mode: 'production',
  output: {
    path: resolve(cwd, './dist'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename],
    },
    name: `${ process.env.NODE_ENV || 'development'}-cache`
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      components: resolve(cwd, "src/components/"),
      utils: resolve(cwd, "src/utils/"),
      services: resolve(cwd, "src/services/"),
      routes: resolve(cwd, "src/routes/"),
      models: resolve(cwd, "src/models/")
    },
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: [
            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: require.resolve("css-loader"),
            options: {
            }
          },
        ]
      },
      { // 处理src 中less
        test: /\.(less)(\?.*)?$/,
        include: [resolve(cwd, "src")],
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: require.resolve("css-loader"),
            options: {
              sourceMap: true,
              importLoaders: 1,
              modules: {
                localIdentName: "[name]_[local]-[hash:base64:5]"
              },
            }
          },
          {
            loader: require.resolve('less-loader'),
            options: {
              lessOptions: {
                javascriptEnabled: true,
                math: "always",
                sourceMap: false
              }
            }
          }
        ],
      },{ // 处理其他less
        test: /\.less$/,
        exclude: [/src/],
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: require.resolve("css-loader"),
            options: {
              importLoaders: 1,
            }
          },
          {
            loader: require.resolve("less-loader"),
            options: {
              lessOptions: {
                javascriptEnabled: true,
                math: "always",
                sourceMap: false
              }
            }
          }
        ],
      },
      {
        test: /\.(ttf|eot|svg|woff|woff2|png|jpg|gif)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 8192
          }
        }
      }
    ]
  },
  plugins: [
    new (require('html-webpack-plugin'))({
      template: resolve(cwd, './public/index.html')
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css?",
      chunkFilename: '[name].chunk.css?',
      ignoreOrder: true
    }),
  ],
  stats: {
    assets: false,
    moduleAssets: false,
    runtime: false,
    runtimeModules: false,
    modules: false,
    entrypoints: false,
  },
}


module.exports = config;
