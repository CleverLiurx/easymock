import {User, Mail, fieldsTable} from '../modal';
import {
  createRes,
  createToken,
  bhash,
  bcompare,
  getRandomInt,
  getRandomAvatar,
} from '../lib';
import {TOKEN} from '../config';
import {
  UserRegisterValidator,
  UserLoginValidator,
  UserVerificationCodeValidator,
} from '../validators/user';
import sendMail from '../lib/send-mail';

export default class UserCtl {
  /**
   * 发送验证码
   * @param {Object} ctx
   */
  static async verificationCode(ctx) {
    const {email} = await new UserVerificationCodeValidator().v(ctx);

    const hasSend = await Mail.findOne({
      email,
      time: {$gte: +new Date() - 300000},
    });

    if (hasSend) {
      ctx.body = createRes.error('验证码已发送，请耐心等待');
      return;
    }

    const code = getRandomInt(1000, 9999);
    await sendMail(email, code);
    await new Mail({email, code, time: +new Date()}).save();
    ctx.body = createRes.success();
  }
  /**
   * 用户注册
   * @param {Object} ctx
   */
  static async register(ctx) {
    const {
      name,
      email,
      password,
      avatar,
      code,
    } = await new UserRegisterValidator().v(ctx);

    const pass = await Mail.findOneAndUpdate(
        {
          email,
          code,
          time: {$gte: +new Date() - 300000},
        },
        {
          time: 0,
        },
    );

    if (!pass) {
      ctx.body = createRes.error('验证码错误或已过期');
      return;
    }

    const user = await new User({
      name,
      email,
      avatar: avatar || getRandomAvatar(),
      password: bhash(password),
    }).save();

    const token = createToken({_id: user._id});
    ctx.cookies.set(
        TOKEN.NAME,
        token,
        {httpOnly: true, SameSite: 'Lax'},
    );

    ctx.body = createRes.success(user, fieldsTable.user);
  }

  /**
   * 用户登录
   * @param {Object} ctx
   */
  static async login(ctx) {
    const {
      email,
      password,
    } = await new UserLoginValidator().v(ctx);

    // await sendMail('13131451002@163.com', '123456');

    const user = await User.findOne({email});

    if (user && bcompare(password, user.password)) {
      const token = createToken({_id: user._id});
      ctx.cookies.set(
          TOKEN.NAME,
          token,
          {httpOnly: true, SameSite: 'Lax'},
      );
      ctx.body = createRes.success(user, fieldsTable.user);
    } else {
      ctx.body = createRes.error('账号或密码错误');
    }
  }

  /**
   * 查询身份信息
   * @param {Object} ctx
   */
  static async info(ctx) {
    const user = await User.findOne({_id: ctx.user?._id});
    if (!user) {
      ctx.body = createRes.error('用户不存在');
      return;
    }
    ctx.body = createRes.success(user, fieldsTable.user);
  }

  /**
   * 退出登录
   * @param {Object} ctx
   */
  static async logout(ctx) {
    ctx.cookies.set(TOKEN.NAME, '', {maxAge: -1});
    ctx.cookies.set(`${TOKEN.NAME}.sig`, '', {maxAge: -1});
    ctx.body = createRes.success();
  }

  /**
   * 检索用户列表
   * @param {Object} ctx
   */
  static async search(ctx) {
    const {kw} = ctx.request.query;

    if (!kw) {
      ctx.body = createRes.success([]);
      return;
    }

    const users = await User.find({
      name: {
        $regex: new RegExp(kw, 'i'),
      },
    });

    const result = users.filter((u) => u._id != ctx.user?._id);

    ctx.body = createRes.success(result, ['_id', 'name', 'avatar']);
  }
}
