module.exports = {
  apps: [{
    name: 'blog-frontend',
    script: 'npm',
    args: 'run dev',
    cwd: '/home/user/webapp',
    instances: 1,
    exec_mode: 'fork',
    watch: false,
    env: {
      NODE_ENV: 'development',
      PORT: 5173
    },
    error_file: './logs/frontend-err.log',
    out_file: './logs/frontend-out.log',
    log_file: './logs/frontend-combined.log',
    time: true,
    max_restarts: 10,
    min_uptime: '10s'
  }]
};
