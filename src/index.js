require('dotenv').config(); // .env 파일에서 환경변수 불러오기 (dotenv 설치 필요)

const Koa = require('koa');
const Router = require('koa-router'); // koa-router
const bodyParser = require('koa-bodyparser'); // request body에 담긴 json 형식의 데이터를 파싱해서 사용할 수 있도록 도와주는 미들웨어
const logger = require('./lib/logger');
const scheduler = require('./cron/cron');

const app = new Koa();
const router = new Router();

app.use(bodyParser()); // 바디파서 적용, 라우터 적용코드보다 상단에 있어야합니다.

// koa에 router 모듈 연결
app
    .use(router.routes())
    .use(router.allowedMethods());

const api = require('./api');
router.use('/api', api.routes());

const port = process.env.PORT || 4000; // PORT 값이 설정되어있지 않다면 4000 을 사용합니다.

router.get('/', (ctx, next) => {
    logger.info('홈 접속 info');
    logger.error('홈 접속 error');
    logger.debug('홈 접속 debug');
    logger.verbose('홈 접속 verbose');
    ctx.body = '홈 화면 입니다.';
});

router.get('/about', (ctx, next) => {
    ctx.body = 'about';
});

router.get('/about/:name', (ctx, next) => {
    // console.log('/about/:name ctx: ', ctx);
    console.log('ctx.request: ', ctx.request);
    console.log('ctx.response: ', ctx.response);
    console.log('ctx.params: ', ctx.params);

    // 라우트 경로에서 :파라미터명 으로 정의된 값이 ctx.params 안에 설정됩니다.
    const { name } = ctx.params;
    ctx.body = name + '의 소개';
});

router.get('/post', (ctx, next) => {
    // console.log('post: ctx: ', ctx);

    // 주소 뒤에 ?id=10 이런식으로 작성된 쿼리는 ctx.request.query 에 파싱됩니다.
    const { id } = ctx.request.query; 
    if(id) {
        ctx.body = '포스트 #' + id;
    } else {
        ctx.body = '포스트 아이디가 없습니다.';
    }
});

app.listen(port, () => {
    console.log(`heurm server is listening to port ${port}`);
});

// initialize scheduler
scheduler();