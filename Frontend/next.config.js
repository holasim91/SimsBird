const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  compress: true,
  webpack(config, { webpack }) {
    const prod = process.env.NODE_ENV === 'production';
    const plugins = [
      new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /^\.\/ko$/),
      ...config.plugins];
    return {
      ...config,
      mode: prod ? 'production' : 'development',
      devtool: prod ? 'hidden-souce-map' : 'eval',
      plugins,
    };
  },
});
