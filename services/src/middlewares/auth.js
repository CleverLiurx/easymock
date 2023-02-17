import {getCtxToken, parseToken, createRes} from '../lib';

export default () => {
  return async (ctx, next) => {
    const apiWhiteList = [
      '/user/register',
      '/user/login',
      '/user/verification_code',
      '/user-http-proxy',
    ];
    const url = ctx.request.url;
    const inWhiteList = apiWhiteList.some((uri) => url.includes(uri));

    if (!inWhiteList) {
      // 获取Token
      const token = getCtxToken(ctx);
      if (!token) {
        ctx.body = createRes.error('请登陆后重试', -1);
        return;
      }

      // 解析Token
      let user;
      try {
        user = parseToken(token);
      } catch (error) {
        if (error.name === 'TokenExpiredError') {
          ctx.body = createRes.error('登录已过期', -1);
          return;
        }

        if (error.name === 'JsonWebTokenError') {
          ctx.body = createRes.error('验证失败请重新登陆', -1);
          return;
        }
      }
      ctx.user = user;
    }
    await next();
  };
};

