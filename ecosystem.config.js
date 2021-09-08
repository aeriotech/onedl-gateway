module.exports = {
  apps: [
    {
      name: 'gateway',
      cluster: true,
      script: './dist/src/main.js',
      wait_ready: true,
      listen_timeout: 5000,
      instances: 4,
    },
  ],
};
