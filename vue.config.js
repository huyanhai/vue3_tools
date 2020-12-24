const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const TerserPlugin = require('terser-webpack-plugin');
const os = require('os');
const path = require('path');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');
const SentryWebpackPlugin = require('@sentry/webpack-plugin');
const semver = require('semver');

const IS_PROD = process.env.NODE_ENV === 'production';
const smp = new SpeedMeasurePlugin({
  disable: !IS_PROD,
});

const getVersion = (dependencies => packageName => {
  if (dependencies[packageName]) {
    // https://docs.npmjs.com/cli/v6/using-npm/semver#ranges
    return semver.minVersion(dependencies[packageName]);
  } else {
    throw new Error(`not found package: ${packageName}`);
  }
})(require('./package.json').dependencies);

module.exports = {
  devServer: {
    host: '0.0.0.0',
    port: 8091,
    disableHostCheck: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    proxy: 'http://127.0.0.1:5000',
  },
  // productionSourceMap: false,
  configureWebpack: smp.wrap({
    module: {
      rules: [
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
      ],
    },
    plugins: [
      IS_PROD && new HardSourceWebpackPlugin(),
      IS_PROD && new BundleAnalyzerPlugin(),
      IS_PROD &&
        new TerserPlugin({
          // sourceMap: false,
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
        .use(SentryWebpackPlugin, [
          {
            // sentry-cli configuration
            authToken: process.env.SENTRY_AUTH_TOKEN,
            org: process.env.SENTRY_ORG,
            project: process.env.SENTRY_PROJECT,

            // webpack specific configuration
            include: './dist',
            ignore: ['css', 'fonts', 'img'],
            release: `${process.env.npm_package_name}@${process.env.npm_package_version}`,
            urlPrefix: '/', // publicPath
          },
        ])
        .end();

      // source-map files need to delete
      // todo del /dist/**/*.map
      // https://webpack.js.org/configuration/devtool/#devtool
      config.devtool('hidden-source-map');
    });
    /* eslint-enable */
  },
};
