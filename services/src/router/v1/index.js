import koaRouter from 'koa-router';
import user from './user';
import project from './project';
import resource from './resource';

const router = koaRouter();
router
    .use('/user', user.routes())
    .use('/project/:projectId/resource', resource.routes())
    .use('/project', project.routes());

export default router;
