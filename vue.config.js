const os = require('os');
const path = require('path');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const TerserPlugin = require('terser-webpack-plugin');
const cssnano = require('cssnano');
const purgecss = require('@fullhuman/postcss-purgecss');

const IS_PROD = process.env.NODE_ENV === 'production';
const smp = new SpeedMeasurePlugin({
  disable: !IS_PROD,
});

// 打包时自动压缩图片
const imgLoader = () => {
  return {
    test: /\.(gif|png|jpe?g|svg)$/i,
    use: [
      {
        loader: 'image-webpack-loader',
        options: {
          progressive: true,
          optimizationLevel: 7,
          interlaced: false,
          mozjpoeg: { quality: 70 },
          pngquant: { quality: '65-90', speed: 4 },
          gifsicle: { interlaced: false },
          webp: { quality: 75 },
        },
      },
    ],
  };
};

module.exports = {
  devServer: {
    host: '0.0.0.0',
    port: 8091,
    disableHostCheck: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    proxy: {
      [process.env.VUE_APP_BASE_API]: {
        target: process.env.VUE_APP_BASE_HOST,
        changeOrigin: true,
        pathRewrite: {
          [`^${process.env.VUE_APP_BASE_API}`]: '',
        },
      },
    },
  },
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          require('tailwindcss'),
          require('autoprefixer'),
          IS_PROD &&
            cssnano({
              preset: 'default',
            }),
          IS_PROD &&
            purgecss({
              content: ['./src/**/*.vue', './src/**/*.jsx'],
              defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
            }),
        ].filter(Boolean),
      },
    },
  },
  publicPath: IS_PROD ? './' : '',
  productionSourceMap: IS_PROD,
  filenameHashing: false,
  configureWebpack: smp.wrap({
    module: {
      rules: [
        IS_PROD && imgLoader(),
        {
          test: /\.js$/,
          include: path.resolve('src'),
          use: [
            {
              loader: 'thread-loader',
              options: {
                workers: os.cpus.length,
                workerParallelJobs: 50,
                workerNodeArgs: ['--max-old-space-size=1024'],
                poolRespawn: false,
                poolTimeout: 2000,
                poolParallelJobs: 50,
                name: 'my-pool',
              },
            },
          ],
        },
      ].filter(Boolean),
    },
    plugins: [
      IS_PROD && new HardSourceWebpackPlugin(),
      IS_PROD &&
        new BundleAnalyzerPlugin({
          openAnalyzer: false,
        }),
      IS_PROD &&
        new TerserPlugin({
          sourceMap: true,
          terserOptions: {
            compress: {
              drop_console: true,
            },
          },
        }),
    ].filter(Boolean),
  }),
};
