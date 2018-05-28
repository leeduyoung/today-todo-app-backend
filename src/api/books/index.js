const Router = require('koa-router');

const books = new Router();
const booksCtrl = require('./books.controller');

books.get('/', booksCtrl.list);
books.post('/', booksCtrl.create);
books.delete('/', booksCtrl.create);
books.put('/', booksCtrl.create);
books.patch('/', booksCtrl.create);

module.exports = books;