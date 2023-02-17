module.exports = {
  apps: [
    {
      name: 'EasyMock Proxy',
      script: 'index.js',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    }
  ]
};
