import koaRouter from 'koa-router';
import v1 from './v1';
import proxy from './proxy';

const router = koaRouter();

router
    .use('/api/v1', v1.routes())
    .use('/user-http-proxy', proxy.routes());

export default router;
