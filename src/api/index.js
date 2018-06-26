const Router = require('koa-router');
const users = require('./users');
const logger = require('../lib/logger');
const api = new Router();

api.use('/users', users.routes());

api.get('/', (ctx, next) => {
    ctx.body = 'api home';
    logger.info('api 접속');
});


module.exports = api;