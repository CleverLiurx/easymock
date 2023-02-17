import {BaseValidator, Rule} from './base';
import {User} from '../modal';

export class UserRegisterValidator extends BaseValidator {
  constructor() {
    super();
    this.name = [
      new Rule('isLength', '请输入1-12位姓名', {min: 1, max: 12}),
    ];
    this.email = [
      new Rule('isEmail', '请输入正确的邮箱'),
    ];
    this.code = [
      new Rule('isInt', '请输入4位验证码', {min: 1000, max: 9999}),
    ];
    this.password = [
      new Rule('isLength', '请输入6-16位密码', {min: 6, max: 16}),
    ];
  }

  async useValidate({email}) {
    const user = await User.findOne({email});
    if (user) {
      throw new Error('此邮箱已经被注册');
    }
  }
}

export class UserLoginValidator extends BaseValidator {
  constructor() {
    super();
    this.email = [
      new Rule('isEmail', '请输入正确的邮箱'),
    ];
    this.password = [
      new Rule('isLength', '请输入密码', {min: 1}),
    ];
  }
}

export class UserVerificationCodeValidator extends BaseValidator {
  constructor() {
    super();
    this.email = [
      new Rule('isEmail', '请输入正确的邮箱'),
    ];
  }
}
