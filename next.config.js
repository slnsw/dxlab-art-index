// require('dotenv').config();
// const webpack = require('webpack');
// const StyleLintPlugin = require('stylelint-webpack-plugin');

module.exports = {
  basePath: '/art-index',
  // dxlab-art-index is proxied to dxlab.sl.nsw.gov.au/art-index, so we need to add a prefix for _next JS files
  // ...(process.env.NODE_ENV === 'production'
  //   ? {
  //       assetPrefix: '/art-index',
  //     }
  //   : {}),
  webpack: (config, { dev }) => {
    const customConfig = {
      ...config,
    };

    customConfig.plugins = config.plugins.filter(
      (plugin) => plugin.constructor.name !== 'UglifyJsPlugin',
    );

    // Next 9 introduced some pretty strict type checking
    // that breaks dev builds. It is now more relaxed,
    // however we may want to introduce again once all types
    // issues fixed
    // https://github.com/zeit/next.js/issues/7687#issuecomment-506440999
    customConfig.plugins = config.plugins.filter((plugin) => {
      if (plugin.constructor.name === 'ForkTsCheckerWebpackPlugin')
        return false;
      return true;
    });

    if (dev) {
      // customConfig.plugins.push(
      //   new StyleLintPlugin({
      //     configFile: './.stylelintrc.js',
      //     // This creates a bunch of stylelint errors to fix - uncomment when ready...
      //     // files: ['**/*.css', '**/*.scss'],
      //     files: ['**/*.css'],
      //     emitErrors: false,
      //   }),
      // );

      customConfig.module.rules.push({
        enforce: 'pre',
        test: /\.(js|ts|tsx)$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
      });
    }

    return customConfig;
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // EnvironmentPlugin stopped working for some reason
  env: {
    FB_APP_ID: process.env.FB_APP_ID,
    GTM_ID: process.env.GTM_ID,
  },
  trailingSlash: true,
};
