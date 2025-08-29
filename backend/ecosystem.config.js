module.exports = {
  apps: [{
    name: 'blog-backend',
    script: 'src/server.js',
    cwd: '/home/user/webapp/backend',
    instances: 1,
    exec_mode: 'fork',
    watch: ['src'],
    watch_delay: 1000,
    ignore_watch: ['node_modules', 'logs', '*.log', 'prisma/dev.db'],
    env: {
      NODE_ENV: 'development',
      PORT: 8000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 8000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    max_restarts: 10,
    min_uptime: '10s'
  }]
};