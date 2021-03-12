const os = require('os');
const path = require('path');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const TerserPlugin = require('terser-webpack-plugin');
const cssnano = require('cssnano');
const purgecss = require('@fullhuman/postcss-purgecss');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');
const SentryPlugin = require('@sentry/webpack-plugin');
const semver = require('semver');

const { version } = require('./package.json');

const IS_PROD = process.env.NODE_ENV === 'production';
const smp = new SpeedMeasurePlugin({
  disable: !IS_PROD,
});

const getVersion = (dependencies => packageName => {
  if (dependencies[packageName]) {
    return semver.minVersion(dependencies[packageName]);
  } else {
    throw new Error(`not found package: ${packageName}`);
  }
})(require('./package.json').dependencies);

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
  chainWebpack(config) {
    /* eslint-disable no-shadow */
    config.when(IS_PROD, config => {
      config.externals({
        '@sentry/vue': 'Sentry',
        '@sentry/tracing': 'Sentry',
      });
      // add Sentry cdn links
      config
        .plugin('production-tags')
        .use(HtmlWebpackTagsPlugin, [
          {
            append: false,
            tags: [
              `https://browser.sentry-cdn.com/${getVersion(
                '@sentry/tracing',
              )}/bundle.tracing.min.js`,
              `https://browser.sentry-cdn.com/${getVersion('@sentry/vue')}/vue.min.js`,
            ],
            publicPath: false,
          },
        ])
        .end();
      // Sentry Source Map Upload Report
      config
        .plugin('sentry')
        .use(SentryPlugin, [
          {
            include: './dist',
            release: `release@${version}`,
            ignore: ['node_modules', 'vue.config.js'],
            configFile: 'sentry.properties',
            urlPrefix: '~/',
          },
        ])
        .end();
    });
  },
};
