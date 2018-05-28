const Koa = require('koa');
const app = new Koa();

const started = new Date();
app.use((ctx, next) => {
    console.log(1);
    next().then(() => {
        // next 는 프로미스로 작업이 끝나고 특정 로직을 실행할 수 있습니다.
        console.log(new Date() - started + 'ms');
    });
});


app.use(async(ctx, next) => {
    console.log(2);
    await next();
    console.log(new Date() - started + 'ms');
});

// ctx는 웹 요청과 응답에 대한 정보를 가지고 있다.
app.use(ctx => {
    // console.log(ctx);
    ctx.body = 'Hello Koa';
});

app.listen(4000, () => {
    console.log('heurm server is listening to port 4000');
});
