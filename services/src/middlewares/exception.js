import {createRes} from '../lib';
import {UserProxyError} from '../lib/error';
const isDev = process.env.NODE_ENV === 'development';

export default () => {
  return async (ctx, next) => {
    try {
      await next();
    } catch (error) {
      if (isDev) {
        console.log(error);
      }
      if (error instanceof UserProxyError) {
        ctx.status = error.code;
        ctx.body = error.message;
      } else {
        const msg = error.message || error.msg || error.toString();
        ctx.body = createRes.error(msg);
      }
    }
  };
};

