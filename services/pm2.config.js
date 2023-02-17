/* eslint camelcase: "off" */

module.exports = {
  apps: [
    {
      name: 'EasyMock API',
      script: 'dist/index.js',
      exec_interpreter: 'babel-node',
      exec_mode: 'fork_mode',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
