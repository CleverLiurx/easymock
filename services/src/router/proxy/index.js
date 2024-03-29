/* eslint-disable max-len */
import Router from 'koa-router';
import ProxyCtl from '../../controller/proxy';
import proxyParase from '../../middlewares/proxy-parase';

const router = new Router();

router
    .get('/(.*)', proxyParase(), ProxyCtl.methodGet)
    .post('/(.*)', proxyParase(), ProxyCtl.methodPost)
    .put('/(.*)', proxyParase(), ProxyCtl.methodPut)
    .delete('/(.*)', proxyParase(), ProxyCtl.methodDelete);

export default router;
