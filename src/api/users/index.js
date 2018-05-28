const Router = require('koa-router');

const users = new Router();

users.get('/', (ctx, next) => {
    ctx.body = 'users home';
})

module.exports = users;


// const Router = require('koa-router');

// const books = new Router();

// books.get('/', (ctx, next) => {
//     ctx.body = 'GET ' + ctx.request.path;
// });

// module.exports = books;