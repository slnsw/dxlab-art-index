require('dotenv').config();
// const webpack = require('webpack');
const StyleLintPlugin = require('stylelint-webpack-plugin');

const redirectRoutes = require('./routes/redirect-routes');

module.exports = {
  webpack: (config, { dev }) => {
    const customConfig = {
      ...config,
    };

    customConfig.plugins = config.plugins.filter(
      (plugin) => plugin.constructor.name !== 'UglifyJsPlugin',
    );

    // Environment variables
    // customConfig.plugins.push(new webpack.EnvironmentPlugin(process.env));

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
      customConfig.plugins.push(
        new StyleLintPlugin({
          configFile: './.stylelintrc.js',
          // This creates a bunch of stylelint errors to fix - uncomment when ready...
          // files: ['**/*.css', '**/*.scss'],
          files: ['**/*.css'],
          emitErrors: false,
        }),
      );

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
    DXLAB_WEBSITE_BASE_URL: process.env.DXLAB_WEBSITE_BASE_URL,
    DXLAB_WEBSITE_GRAPHQL_URL: process.env.DXLAB_WEBSITE_GRAPHQL_URL,
    DXLAB_WEBSITE_FB_APP_ID: process.env.DXLAB_WEBSITE_FB_APP_ID,
    DXLAB_WEBSITE_GTM_ID: process.env.DXLAB_WEBSITE_GTM_ID,
  },
  trailingSlash: true,
  async redirects() {
    return [
      // Redirect old permalinks
      {
        source: '/open-data/',
        destination: '/code/',
        permanent: true,
      },
      {
        source: '/fellowships/',
        destination: '/grants/',
        permanent: true,
      },
      {
        source: '/unstacked/',
        destination: 'https://unstacked.dxlab.sl.nsw.gov.au',
        permanent: true,
      },
      // Redirect old blog posts that had slug in root dir
      ...redirectRoutes.map((route) => {
        return {
          source: route,
          destination: `/blog${route}`,
          permanent: true,
        };
      }),
    ];
  },
  // The rewrites below do work, but multiple entries to do simple path
  // matching is not very elegant. Need to explore regex more.
  // Disabling for now and using vercel.json rewrites
  // async rewrites() {
  //   return [
  //     {
  //       source: '/:path*/',
  //       destination: '/:path*/',
  //     },
  //     {
  //       source: '/aereo/',
  //       destination:
  //         'http://dxlab-fellowship-2019.s3-website-ap-southeast-2.amazonaws.com/aereo/',
  //     },
  //     {
  //       source: '/aereo/:path*',
  //       destination:
  //         'http://dxlab-fellowship-2019.s3-website-ap-southeast-2.amazonaws.com/aereo/:path*',
  //     },
  //     {
  //       source: '/aereo/data/:path*',
  //       destination:
  //         'http://dxlab-fellowship-2019.s3-website-ap-southeast-2.amazonaws.com/:path*',
  //     },
  //     {
  //       source: '/virtuoso/',
  //       destination: 'https://dxlab-virtuoso.vercel.app/virtuoso/',
  //     },
  //     {
  //       source: '/virtuoso/:path*',
  //       destination: 'https://dxlab-virtuoso.vercel.app/virtuoso/:path*',
  //     },
  //     {
  //       source: '/virtuoso/:path*/',
  //       destination: 'https://dxlab-virtuoso.vercel.app/virtuoso/:path*/',
  //     },
  //   ];
  // },
};
