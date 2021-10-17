module.exports = {
  apps: [
    {
      name: 'downzoo-moneybook-web',
      script: 'downzoo-moneybook-web-server.js'
    },
  ],
  deploy: {
    production: {
      user: 'root',
      host: '121.41.2.76',
      ref: 'origin/master',
      repo: 'git@github.com:maidangzhu/downzoo-moneybook-web.git',
      path: '/home/downzoo/downzoo-moneybook/downzoo-moneybook-web',
      'post-deploy': 'git reset --hard && git checkout master && git pull && npm i --production=false && pm2 startOrReload ecosystem.config.js',
      env: {
        NODE_ENV: 'production'
      },
    }
  }
}
