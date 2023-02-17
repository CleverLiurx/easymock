import Router from 'koa-router';
import UserCtl from '../../controller/user';

const router = new Router();

router.post('/register', UserCtl.register);
router.post('/login', UserCtl.login);
router.get('/userinfo', UserCtl.info);
router.post('/logout', UserCtl.logout);
router.post('/verification_code', UserCtl.verificationCode);
router.get('/', UserCtl.search);

export default router;
