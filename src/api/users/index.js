const Router = require('koa-router');

const users = new Router();

users.get('/', (ctx, next) => {
    ctx.body = 'users home';
})

module.exports = users;