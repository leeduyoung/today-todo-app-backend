const Router = require('koa-router');

const api = new Router();

const books = require('./books');
api.use('/books', books.routes());

const users = require('./users');
api.use('/users', users.routes());

api.get('/', (ctx, next) => {
    ctx.body = 'GET2 ' + ctx.request.path;
});

module.exports = api;