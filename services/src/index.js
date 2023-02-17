import Koa from 'koa';
import cors from '@koa/cors';
import koaBody from 'koa-body';
import servStatic from 'koa-static';
import path from 'path';
import auth from './middlewares/auth';
import router from './router';
import exception from './middlewares/exception';
import ratelimit from './middlewares/ratelimit';

const app = new Koa();
const PORT = 9907;

app
    .use(cors({credentials: true}))
    .use(servStatic(path.join(__dirname, '../../web/build')))
    .use(exception())
    .use(auth())
    .use(koaBody())
    .use(ratelimit())
    .use(router.routes());


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
