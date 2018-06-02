const Book = require('../../model/book');
const Joi = require('joi');
const { Types: { ObjectId } } = require('mongoose'); // 아래 주석해둔 코드와 동일
// const ObjectId = require('mongoose').Types.ObjectId

exports.list = async (ctx) => {
    // 변수를 미리 만들어줍니다. 
    // (let 이나 const 는 scope 가 블록단위이기 때문에, try 바깥에 선언을 해줍니다)

    let books;

    try {
        // 데이터를 조회합니다. 
        // .exec() 를 뒤에 붙여줘야 실제로 데이터베이스에 요청이 됩니다.
        // 반환값은 Promise 이므로 await 을 사용 할 수 있습니다.

        books = await Book.find()
            .sort({ _id: -1 }) // _id 의 역순으로 정렬합니다
            .limit(3) // 3개반 보여지도록 정렬합니다
            .exec(); // 데이터를 서버에 요청합니다.

    }
    catch (e) {
        return ctx.throw(500, e);
    }

    ctx.body = books;
};

exports.get = async (ctx) => {
    const { id } = ctx.params;

    let book;

    try {
        book = await Book.findById(id).exec();
    }
    catch (e) {
        if (e.name === 'CastError') {
            ctx.status = 400;
            return;
        }
        return ctx.throw(500, e);
    }

    if (!book) {
        // 존재하지 않으면
        ctx.status = 404;
        ctx.body = { message: 'book not found' };
        return;
    }

    ctx.body = book;
}

/**
 * remove: 특정 조건을 만족하는 데이터들을 모두 지웁니다.
 * findByIdAndRemove: id 를 찾아서 지웁니다.
 * findOneAndRemove: 특정 조건을 만족하는 데이터 하나를 찾아서 지웁니다.
 * @param {*} ctx 
 */
exports.delete = async (ctx) => {
    const { id } = ctx.params; // URL 파라미터에서 id 값을 읽어옵니다.

    try {
        await Book.findByIdAndRemove(id).exec();
    } catch (e) {
        if (e.name === 'CastError') {
            ctx.status = 400;
            return;
        }
    }

    ctx.status = 204; // No Content
};

/**
 * PUT 과 PATCH 는 서로 비슷하지만, 역할이 다릅니다. 둘 다 데이터를 변경하는데요, 
 * PUT 의 경우엔 데이터를 통째로 바꿔버리는 메소드이며, PATCH 의 경우엔 주어진 필드만 수정하는 메소드입니다.
 * 따라서, 구현 방식은 비슷 할 수도 있겠지만, PUT 의 경우엔 모든 필드를 받도록 데이터를 검증해야합니다.
 * 추가적으로 PUT 의 경우에 데이터가 존재하지 않는다면 데이터를 새로 만들어주어야 하는게 원칙입니다.
 * Request Body 를 검증하려면, if 문, 혹은 배열과 반복문을 통하여 각 필드를 일일히 체크하는 방식도 있겠지만, 
 * 이를 더 편리하게 해주는 라이브러리(Joi)가 존재합니다. 심지어 값의 형식도 검사를 할 수 있게 해줍니다.
 */

exports.replace = async (ctx) => {
    const { id } = ctx.params; // URL 파라미터에서 id 값을 읽어옵니다.

    if (!ObjectId.isValid(id)) {
        ctx.status = 400; // Bad Request
        return;
    }

    // 먼저, 검증 할 스키마를 준비해야합니다.
    const schema = Joi.object().keys({ // 객체의 field 를 검증합니다.
        // 뒤에 required() 를 붙여주면 필수 항목이라는 의미입니다
        title: Joi.string().required(),
        authors: Joi.array().items(Joi.object().keys({
            name: Joi.string().required(),
            email: Joi.string().email().required() // 이런식으로 이메일도 손쉽게 검증가능합니다
        })),
        publishedDate: Joi.date().required(),
        price: Joi.number().required(),
        tags: Joi.array().items((Joi.string()).required())
    });

    // 그 다음엔, validate 를 통하여 검증을 합니다.
    const result = Joi.validate(ctx.request.body, schema); // 첫번째 파라미터는 검증할 객체이고, 두번째는 스키마입니다.

    // 스키마가 잘못됐다면
    if (result.error) {
        ctx.status = 400; // Bad Request
        ctx.body = result.error;
        return;
    }

    let book;

    try {
        // 아이디로 찾아서 업데이트를 합니다.
        // 파라미터는 (아이디, 변경 할 값, 설정) 순 입니다.
        book = await Book.findByIdAndUpdate(id, ctx.request.body, {
            upsert: true, // 이 값을 넣어주면 데이터가 존재하지 않으면 새로 만들어줍니다
            new: true // 이 값을 넣어줘야 반환하는 값이 업데이트된 데이터입니다.
            // 이 값이 없으면 ctx.body = book 했을때 업데이트 전의 데이터를 보여줍니다.
        });
    }
    catch (e) {
        return ctx.throw(500, e);
    }
    ctx.body = book;
}

// patch는 특정 필드만 업데이트 된다.
exports.update = async (ctx) => {
    const { id } = ctx.params; // URL 파라미터에서 id 값을 읽어옵니다.

    if(!ObjectId.isValid(id)) {
        ctx.status = 400; // Bad Request
        return;
    }

    let book;

    try {
        // 아이디로 찾아서 업데이트를 합니다.
        // 파라미터는 (아이디, 변경 할 값, 설정) 순 입니다.
        book = await Book.findByIdAndUpdate(id, ctx.request.body, {
            // upsert 의 기본값은 false 입니다.
            new: true // 이 값을 넣어줘야 반환하는 값이 업데이트된 데이터입니다. 이 값이 없으면 ctx.body = book 했을때 업데이트 전의 데이터를 보여줍니다.
        });
    } catch (e) {
        return ctx.throw(500, e);
    }

    ctx.body = book;
};

exports.create = async (ctx) => {

    console.log(ctx.request.body);

    // request body 에서 값들을 추출합니다
    const {
        title,
        authors,
        publishedDate,
        price,
        tags
    } = ctx.request.body;

    // Book 인스턴스를 생성합니다
    const book = new Book({
        title,
        authors,
        publishedDate,
        price,
        tags
    });

    // 만들어진 Book 인스턴스를, 이렇게 수정 할 수도 있습니다.
    // book.title = title;

    //.save() 함수를 실행하면 이 때 데이터베이스에 실제로 데이터를 작성합니다.
    // Promise 를 반환합니다.
    try {
        await book.save();
    }
    catch (e) {
        // HTTP 상태 500 와 Internal Error 라는 메시지를 반환하고, 
        // 에러를 기록합니다.
        return ctx.throw(500, e);
    }

    // 저장한 결과를 반환합니다.
    ctx.body = book;
};