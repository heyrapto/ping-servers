module.exports = {
  apps: [
    {
      name: "ping-servers",
      script: "dist/ping.js",
      instances: 1,
      exec_mode: "fork",
      watch: false,
      env: {
        NODE_ENV: "production"
      },
      autorestart: true,
      max_restarts: 10,
      restart_delay: 5000
    }
  ]
};

