const Router = require('koa-router');
const users = require('./users');
const api = new Router();

api.use('/users', users.routes());

api.get('/', (ctx, next) => {
    ctx.body = 'api home';
});


module.exports = api;