const Router = require('koa-router');
const logger = require('../../lib/logger');

const users = new Router();

users.get('/', (ctx, next) => {
    ctx.body = 'users home';
    logger.info('users 접속');
})

module.exports = users;