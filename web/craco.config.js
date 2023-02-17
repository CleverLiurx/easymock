const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
    },
  ],
  devServer: (devServerConfig, {env, paths, proxy, allowedHost}) => {
    devServerConfig.proxy = {
      '/api/v1': {
        target: 'http://localhost:9907',
        changeOrigin: true,
      },
    };
    return devServerConfig;
  },
};
